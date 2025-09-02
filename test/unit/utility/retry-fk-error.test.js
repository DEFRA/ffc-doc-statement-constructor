process.env.RETRY_FK_MAX_RETRIES = '3'
process.env.RETRY_FK_BASE_DELAY_MS = '10'
process.env.RETRY_FK_MAX_TOTAL_DELAY_MS = '1000'
const pathToTest = '../../../app/utility/retry-fk-error'

jest.useFakeTimers()

const { retryOnFkError, parseEnvInt, createWrappedError } = require(pathToTest) // Updated: Destructure the new functions
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
  })

  test('should throw wrapped error when give-up occurs (exceed max attempts or total delay)', async () => {
    const fkError = new Sequelize.ForeignKeyConstraintError()
    fn = jest.fn(() => Promise.reject(fkError))

    const promise = retryOnFkError(fn, context, identifier)
    for (let i = 0; i < 20; i++) {
      jest.runOnlyPendingTimers()
      await Promise.resolve()
    }

    await expect(promise).rejects.toThrow(/would exceed max total retry time|after \d+ attempts/)
  }, 15000)

  test('should rethrow immediately on non-FK error', async () => {
    const otherError = new Error('Some other error')
    fn = jest.fn().mockRejectedValue(otherError)

    await expect(retryOnFkError(fn, context, identifier)).rejects.toThrow('Some other error')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('wrapped error should reference the original FK error (either .cause or .originalError)', async () => {
    const fkError = new Sequelize.ForeignKeyConstraintError()
    fn = jest.fn(() => Promise.reject(fkError))

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

  test('parseEnvInt handles invalid env values', () => {
    process.env.TEST_VAR = 'invalid'
    expect(parseEnvInt('TEST_VAR')).toBeUndefined()
    delete process.env.TEST_VAR
  })

  test('createWrappedError sets cause and data correctly', () => {
    const cause = new Error('cause')
    const data = { key: 'value' }
    const wrapped = createWrappedError('msg', cause, data)
    expect(wrapped.message).toBe('msg')
    expect(wrapped.cause || wrapped.originalError).toBe(cause)
    expect(wrapped.data).toEqual({ data })
  })
})
