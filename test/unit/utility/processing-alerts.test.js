const { dataProcessingAlert } = require('../../../app/utility/processing-alerts')

jest.mock('../../../app/messaging/create-alerts', () => ({
  createAlerts: jest.fn().mockResolvedValue(undefined)
}))
const { createAlerts } = require('../../../app/messaging/create-alerts')

describe('dataProcessingAlert', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // restore console methods if any test replaced them
    if (console.error.mockRestore) {
      try { console.error.mockRestore() } catch (e) {}
    }
  })

  test('throws if payload is not an object', async () => {
    await expect(dataProcessingAlert(null)).rejects.toThrow(TypeError)
    await expect(dataProcessingAlert('string')).rejects.toThrow(/payload must be an object/)
  })

  test('throws if payload.process is missing or not a string', async () => {
    await expect(dataProcessingAlert({})).rejects.toThrow(/payload.process/)
    await expect(dataProcessingAlert({ process: 123 })).rejects.toThrow(/payload.process/)
  })

  test('uses Error.message when payload.error is an Error and keeps the Error object', async () => {
    const payload = {
      process: 'proc-err',
      error: new Error('boom!')
    }

    await dataProcessingAlert(payload)

    expect(createAlerts).toHaveBeenCalledTimes(1)
    const [argArray] = createAlerts.mock.calls[0]
    expect(Array.isArray(argArray)).toBe(true)
    const alert = argArray[0]
    expect(alert.message).toBe('boom!')
    expect(alert.error).toBeInstanceOf(Error)
    expect(alert.process).toBe('proc-err')
  })

  test('uses object.message when payload.error is an object with message', async () => {
    const errObj = { message: 'object-message', code: 'X' }
    const payload = { process: 'proc-obj', error: errObj }

    await dataProcessingAlert(payload, 'MY_TYPE')

    expect(createAlerts).toHaveBeenCalledTimes(1)
    const [argArray, argType] = createAlerts.mock.calls[0]
    const alert = argArray[0]
    expect(alert.message).toBe('object-message')
    // the error remains the object (not cleared)
    expect(alert.error).toBe(errObj)
    expect(argType).toBe('MY_TYPE')
  })

  test('uses string error as message and clears error property', async () => {
    const payload = { process: 'proc-str', error: 'string-error' }

    await dataProcessingAlert(payload)

    expect(createAlerts).toHaveBeenCalledTimes(1)
    const [argArray] = createAlerts.mock.calls[0]
    const alert = argArray[0]
    expect(alert.message).toBe('string-error')
    expect(alert.error).toBeUndefined()
  })

  test('preserves an explicit non-empty message', async () => {
    const payload = {
      process: 'proc-msg',
      message: 'explicit message',
      error: new Error('boom')
    }

    await dataProcessingAlert(payload)

    expect(createAlerts).toHaveBeenCalledTimes(1)
    const [argArray] = createAlerts.mock.calls[0]
    const alert = argArray[0]
    expect(alert.message).toBe('explicit message')
    // original error still present
    expect(alert.error).toBeInstanceOf(Error)
  })

  test('replaces whitespace-only message with derived message from error', async () => {
    const payload = {
      process: 'proc-space',
      message: '   ',
      error: new Error('derived-msg')
    }

    await dataProcessingAlert(payload)

    expect(createAlerts).toHaveBeenCalledTimes(1)
    const [argArray] = createAlerts.mock.calls[0]
    const alert = argArray[0]
    expect(alert.message).toBe('derived-msg')
  })

  test('logs and swallows createAlerts error when throwOnPublishError is false', async () => {
    const payload = { process: 'proc-swall' }
    const publishError = new Error('publish failed')

    createAlerts.mockRejectedValueOnce(publishError)
    console.error = jest.fn()

    // should not throw because throwOnPublishError default is false
    await expect(dataProcessingAlert(payload)).resolves.toBeUndefined()

    expect(createAlerts).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Failed to publish processing alert for proc-swall'), publishError)
  })

  test('rethrows createAlerts error when throwOnPublishError is true', async () => {
    const payload = { process: 'proc-throw' }
    const publishError = new Error('publish failed again')

    createAlerts.mockRejectedValueOnce(publishError)

    await expect(dataProcessingAlert(payload, undefined, { throwOnPublishError: true })).rejects.toThrow(publishError)
    expect(createAlerts).toHaveBeenCalledTimes(1)
  })
})
