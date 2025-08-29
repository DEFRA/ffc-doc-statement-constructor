const pathToTest = '../../../app/utility/retry-fk-error'

// Use fake timers to control the backoff delays
jest.useFakeTimers()

// Mock the processing-alerts module before loading the module under test
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
    // reset mocks and spies before each test
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
      .mockRejectedValueOnce(fkError) // first call -> FK error
      .mockResolvedValueOnce('success') // second call -> success

    const promise = retryOnFkError(fn, context, identifier)

    // allow the first rejection to be handled
    await Promise.resolve()
    // advance the delay for the first retry (BASE_DELAY_MS = 5000)
    jest.runOnlyPendingTimers()
    // wait for the promise to resolve
    const result = await promise

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
    expect(consoleWarnSpy).toHaveBeenCalled()
    // no alert should be sent for the successful retry path
    expect(processingAlerts.dataProcessingAlert).not.toHaveBeenCalled()
  })

  test('should call dataProcessingAlert and throw when total delay would exceed MAX_TOTAL_DELAY_MS', async () => {
    const fkError = new Sequelize.ForeignKeyConstraintError()
    // always fail with FK error
    fn = jest.fn(() => Promise.reject(fkError))

    // Make sure the mocked alert resolves (so we can assert it was called)
    processingAlerts.dataProcessingAlert.mockResolvedValueOnce(undefined)

    const promise = retryOnFkError(fn, context, identifier)

    // Fast-forward timers and microtasks for many cycles to reach the "would exceed max total retry time" branch.
    // The implementation uses exponential backoff and will eventually reach the exceed branch; iterate enough cycles.
    for (let i = 0; i < 20; i++) {
      jest.runOnlyPendingTimers()
      // allow any pending microtasks to run
      // eslint-disable-next-line no-await-in-loop
      await Promise.resolve()
    }

    await expect(promise).rejects.toThrow(/would exceed max total retry time/)

    // dataProcessingAlert should have been called with an object that contains our context/identifier and a message including 'would exceed'
    expect(processingAlerts.dataProcessingAlert).toHaveBeenCalled()
    const alertArg = processingAlerts.dataProcessingAlert.mock.calls[0][0]
    expect(alertArg).toMatchObject({
      process: 'retryOnFkError',
      context,
      identifier
    })
    expect(alertArg.message).toMatch(/would exceed max total retry time/)
  }, 15000)

  test('should alert and rethrow immediately on non-FK error (and log if alert fails)', async () => {
    // 1) When alert succeeds
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

    // 2) When alert fails (simulate alert throwing) => console.error should be used but original error rethrown
    processingAlerts.dataProcessingAlert.mockRejectedValueOnce(new Error('alert failure'))
    fn = jest.fn().mockRejectedValue(new Error('another non-FK'))

    await expect(retryOnFkError(fn, context, identifier)).rejects.toThrow('another non-FK')
    expect(processingAlerts.dataProcessingAlert).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })
})
