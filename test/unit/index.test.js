jest.mock('../../app/messaging')
const mockMessaging = require('../../app/messaging')

jest.mock('../../app/processing')
const mockProcessing = require('../../app/processing')
jest.mock('../../app/messaging/wait-for-idle-messaging')

describe('app', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('should call mockMessaging.start when app is imported', async () => {
    expect(mockMessaging.start).toHaveBeenCalled()
  })

  test('should call mockMessaging.start once when app is imported', async () => {
    expect(mockMessaging.start).toHaveBeenCalledTimes(1)
  })

  test('should call mockProcessing.start when app is imported', async () => {
    expect(mockProcessing.start).toHaveBeenCalled()
  })

  test('should call mockProcessing.start once when app is imported', async () => {
    expect(mockProcessing.start).toHaveBeenCalledTimes(1)
  })

  test('should not call mockMessaging.stop when app is imported', async () => {
    expect(mockMessaging.stop).not.toHaveBeenCalled()
  })
})

describe('app alerting init', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('calls alerting.init when available', () => {
    const mockInit = jest.fn()
    jest.doMock('ffc-alerting-utils', () => ({ init: mockInit }))
    jest.doMock('../../app/messaging', () => ({ start: jest.fn(), stop: jest.fn() }))
    jest.doMock('../../app/processing', () => ({ start: jest.fn() }))

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
      defaultType: DATA_PROCESSING_ERROR
    })

    expect(process.env.ALERT_TOPIC).toBe('pre-existing-topic')
    expect(process.env.ALERT_SOURCE).toBe('pre-existing-source')
    expect(process.env.ALERT_TYPE).toBe('pre-existing-type')
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
})
