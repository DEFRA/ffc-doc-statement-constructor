process.env.RETRY_FK_MAX_RETRIES = '3'
process.env.RETRY_FK_BASE_DELAY_MS = '10'
process.env.RETRY_FK_MAX_TOTAL_DELAY_MS = '1000'
const pathToTest = '../../../app/utility/retry-fk-error'

jest.useFakeTimers()
jest.mock('../../../app/utility/processing-alerts', () => ({
  dataProcessingAlert: jest.fn()
}))

const processingAlerts = require('../../../app/utility/processing-alerts')
const { retryOnFkError } = require(pathToTest)
const { Sequelize } = require('../../../app/data')

describe('retryOnFkError', () => {
  let fn
  let context
  let identifier
  let consoleWarnSpy
  let consoleErrorSpy

  beforeEach(() => {
    jest.clearAllMocks()
    context = 'testContext'
    identifier = 'testId'
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  test('should return result if no error occurs', async () => {
    fn = jest.fn().mockResolvedValue('success')
    const result = await retryOnFkError(fn, context, identifier)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(processingAlerts.dataProcessingAlert).not.toHaveBeenCalled()
    expect(consoleWarnSpy).not.toHaveBeenCalled()
  })

  test('should retry on ForeignKeyConstraintError and eventually succeed (logs warn)', async () => {
    const fkError = new Sequelize.ForeignKeyConstraintError()
    fn = jest
      .fn()
      .mockRejectedValueOnce(fkError)
      .mockResolvedValueOnce('success')

    const promise = retryOnFkError(fn, context, identifier)

    await Promise.resolve()
    jest.runOnlyPendingTimers()
    const result = await promise

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
    expect(consoleWarnSpy).toHaveBeenCalled()
    expect(processingAlerts.dataProcessingAlert).not.toHaveBeenCalled()
  })

  test('should call dataProcessingAlert and throw when give-up occurs (either exceed total delay or max attempts)', async () => {
    const fkError = new Sequelize.ForeignKeyConstraintError()
    fn = jest.fn(() => Promise.reject(fkError))

    processingAlerts.dataProcessingAlert.mockResolvedValueOnce(undefined)

    const promise = retryOnFkError(fn, context, identifier)
    for (let i = 0; i < 20; i++) {
      jest.runOnlyPendingTimers()
      await Promise.resolve()
    }

    await expect(promise).rejects.toThrow(/would exceed max total retry time|after \d+ attempts/)

    expect(processingAlerts.dataProcessingAlert).toHaveBeenCalled()
    const alertArg = processingAlerts.dataProcessingAlert.mock.calls[0][0]
    expect(alertArg).toMatchObject({
      process: 'retryOnFkError',
      context,
      identifier
    })
    expect(alertArg.message).toMatch(/would exceed max total retry time|after \d+ attempts/)
  }, 15000)

  test('should alert and rethrow immediately on non-FK error (and log if alert fails)', async () => {
    const otherError = new Error('Some other error')
    fn = jest.fn().mockRejectedValue(otherError)
    processingAlerts.dataProcessingAlert.mockResolvedValueOnce(undefined)

    await expect(retryOnFkError(fn, context, identifier)).rejects.toThrow('Some other error')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(processingAlerts.dataProcessingAlert).toHaveBeenCalled()
    const callArg = processingAlerts.dataProcessingAlert.mock.calls[0][0]
    expect(callArg).toMatchObject({
      process: 'retryOnFkError',
      context,
      identifier
    })
    expect(callArg.message).toMatch(/Non-FK error thrown/)

    processingAlerts.dataProcessingAlert.mockRejectedValueOnce(new Error('alert failure'))
    fn = jest.fn().mockRejectedValue(new Error('another non-FK'))

    await expect(retryOnFkError(fn, context, identifier)).rejects.toThrow('another non-FK')
    expect(processingAlerts.dataProcessingAlert).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  test('wrapped error should reference the original FK error (either .cause or .originalError)', async () => {
    const fkError = new Sequelize.ForeignKeyConstraintError()
    fn = jest.fn(() => Promise.reject(fkError))

    processingAlerts.dataProcessingAlert.mockResolvedValue(undefined)
    const promise = retryOnFkError(fn, context, identifier)

    for (let i = 0; i < 20; i++) {
      jest.runOnlyPendingTimers()
      await Promise.resolve()
    }

    let thrownErr
    try {
      await promise
    } catch (err) {
      thrownErr = err
    }

    expect(thrownErr).toBeDefined()
    const causeMatches = thrownErr.cause === fkError
    const originalMatches = thrownErr.originalError === fkError
    expect(causeMatches || originalMatches).toBe(true)
  })
})
