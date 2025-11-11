jest.mock('../../app/messaging')
const mockMessaging = require('../../app/messaging')

jest.mock('../../app/processing')
const mockProcessing = require('../../app/processing')
jest.mock('log-timestamp', () => jest.fn())

describe('app', () => {
  let consoleErrorSpy
  let processExitSpy

  beforeEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    processExitSpy.mockRestore()
  })

  test.each([
    ['mockMessaging.start', mockMessaging.start],
    ['mockProcessing.start', mockProcessing.start]
  ])('should call %s when app is imported', async (_, mockFn) => {
    jest.isolateModules(() => {
      require('../../app')
    })
    await new Promise(setImmediate)
    expect(mockFn).toHaveBeenCalled()
  })

  test.each([
    ['mockMessaging.start', mockMessaging.start],
    ['mockProcessing.start', mockProcessing.start]
  ])('should call %s once when app is imported', async (_, mockFn) => {
    jest.isolateModules(() => {
      require('../../app')
    })
    await new Promise(setImmediate)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  test('should not call mockMessaging.stop when app is imported', async () => {
    jest.isolateModules(() => {
      require('../../app')
    })
    await new Promise(setImmediate)
    expect(mockMessaging.stop).not.toHaveBeenCalled()
  })

  test.each([
    ['messaging startup', new Error('Startup failed'), mockMessaging.start],
    ['processing startup', new Error('Processing startup failed'), mockProcessing.start]
  ])('should handle %s errors and exit with code 1', async (_, error, mockFn) => {
    if (mockFn === mockProcessing.start) {
      mockMessaging.start.mockResolvedValueOnce()
    }
    mockFn.mockRejectedValueOnce(error)

    jest.isolateModules(() => {
      require('../../app')
    })
    await new Promise(setImmediate)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to start application:', error)
    expect(processExitSpy).toHaveBeenCalledWith(1)
  })

  test.each([
    ['SIGTERM'],
    ['SIGINT']
  ])('should call messaging.stop and process.exit on %s', async (signal) => {
    const stopSpy = jest.spyOn(mockMessaging, 'stop').mockResolvedValue()

    jest.isolateModules(() => {
      require('../../app')
    })

    process.emit(signal)
    await new Promise(setImmediate)

    expect(stopSpy).toHaveBeenCalled()
    expect(processExitSpy).toHaveBeenCalledWith(0)
    stopSpy.mockRestore()
  })

  test.each([
    ['SIGTERM'],
    ['SIGINT']
  ])('should handle errors in %s handler and still exit', async (signal) => {
    const stopError = new Error('Stop failed')
    const stopSpy = jest.spyOn(mockMessaging, 'stop').mockRejectedValue(stopError)

    jest.isolateModules(() => {
      require('../../app')
    })

    process.emit(signal)
    await new Promise(setImmediate)

    expect(stopSpy).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error during shutdown:', stopError)
    expect(processExitSpy).toHaveBeenCalledWith(0)
    stopSpy.mockRestore()
  })
})

describe('app alerting init', () => {
  const OLD_ENV = process.env
  let consoleWarnSpy

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env = { ...OLD_ENV }
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    process.env = OLD_ENV
    consoleWarnSpy.mockRestore()
  })

  test('calls alerting.init when available', () => {
    const mockInit = jest.fn()
    jest.doMock('ffc-alerting-utils', () => ({ init: mockInit }))
    jest.doMock('../../app/messaging', () => ({ start: jest.fn(), stop: jest.fn() }))
    jest.doMock('../../app/processing', () => ({ start: jest.fn() }))
    const mockEventPublisher = jest.fn()
    jest.doMock('ffc-pay-event-publisher', () => ({ EventPublisher: mockEventPublisher }))

    process.env.ALERT_TOPIC = 'pre-existing-topic'
    process.env.ALERT_SOURCE = 'pre-existing-source'
    process.env.ALERT_TYPE = 'pre-existing-type'

    const messageConfig = require('../../app/config/message')
    const { SOURCE } = require('../../app/constants/source')
    const { DATA_PROCESSING_ERROR } = require('../../app/constants/alerts')

    require('../../app')

    expect(mockInit).toHaveBeenCalledTimes(1)
    expect(mockInit).toHaveBeenCalledWith({
      topic: messageConfig.alertTopic,
      source: SOURCE,
      defaultType: DATA_PROCESSING_ERROR,
      EventPublisherClass: mockEventPublisher
    })
  })

  test('sets process.env when alerting.init not available', () => {
    jest.doMock('ffc-alerting-utils', () => ({}))
    jest.doMock('../../app/messaging', () => ({ start: jest.fn(), stop: jest.fn() }))
    jest.doMock('../../app/processing', () => ({ start: jest.fn() }))

    delete process.env.ALERT_TOPIC
    delete process.env.ALERT_SOURCE
    delete process.env.ALERT_TYPE

    const messageConfig = require('../../app/config/message')
    const { SOURCE } = require('../../app/constants/source')
    const { DATA_PROCESSING_ERROR } = require('../../app/constants/alerts')

    require('../../app')

    expect(process.env.ALERT_SOURCE).toBe(SOURCE)
    expect(process.env.ALERT_TYPE).toBe(DATA_PROCESSING_ERROR)
    expect(process.env.ALERT_TOPIC).toEqual(messageConfig.alertTopic)
  })

  test('handles alerting utils initialization error', () => {
    const alertingError = new Error('Alerting init failed')
    jest.doMock('ffc-alerting-utils', () => {
      throw alertingError
    })
    jest.doMock('../../app/messaging', () => ({ start: jest.fn(), stop: jest.fn() }))
    jest.doMock('../../app/processing', () => ({ start: jest.fn() }))

    require('../../app')
    expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to initialize alerting utils:', alertingError.message)
  })
})
