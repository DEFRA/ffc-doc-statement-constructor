describe('wait for idle subscription', () => {
  const processName = 'TestProcess'
  let consoleInfoSpy, consoleErrorSpy

  const subscription = {
    topic: 'test-topic'
  }

  const mockPeekMessages = jest.fn()
  const mockCloseConnection = jest.fn()
  const mockSleep = jest.fn()
  const mockDataProcessingAlert = jest.fn()

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    jest.doMock('ffc-messaging', () => ({
      MessageReceiver: jest.fn().mockImplementation(() => ({
        peekMessages: mockPeekMessages,
        closeConnection: mockCloseConnection
      }))
    }))

    jest.doMock('../../../app/messaging/sleep', () => mockSleep)
    jest.doMock('ffc-alerting-utils', () => ({
      dataProcessingAlert: mockDataProcessingAlert
    }))

    mockPeekMessages.mockResolvedValue([])
    mockCloseConnection.mockResolvedValue()
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    consoleInfoSpy?.mockRestore()
    consoleErrorSpy?.mockRestore()
  })

  test('should verify mocks are working', () => {
    const { dataProcessingAlert } = require('ffc-alerting-utils')
    const sleep = require('../../../app/messaging/sleep')

    expect(jest.isMockFunction(dataProcessingAlert)).toBe(true)
    expect(jest.isMockFunction(sleep)).toBe(true)
    expect(dataProcessingAlert).toBe(mockDataProcessingAlert)
  })

  test('should call peekMessages with batch size', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')
    const config = require('../../../app/config/message')

    await waitForIdleSubscription(subscription, processName)
    expect(mockPeekMessages).toHaveBeenCalledWith(config.idleCheckBatchSize, { fromSequenceNumber: expect.anything() })
  })

  test('should call peekMessages once if no messages', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    await waitForIdleSubscription(subscription, processName)
    expect(mockPeekMessages).toHaveBeenCalledTimes(1)
  })

  test('should not call sleep if no messages', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    await waitForIdleSubscription(subscription, processName)
    expect(mockSleep).not.toHaveBeenCalled()
  })

  test('should call peekMessages once if all messages have more than one delivery attempt', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    mockPeekMessages.mockResolvedValue([
      { deliveryCount: 2 }
    ])
    await waitForIdleSubscription(subscription, processName)
    expect(mockPeekMessages).toHaveBeenCalledTimes(1)
  })

  test('should not call sleep if all messages have more than one delivery attempt', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    mockPeekMessages.mockResolvedValue([
      { deliveryCount: 2 }
    ])
    await waitForIdleSubscription(subscription, processName)
    expect(mockSleep).not.toHaveBeenCalled()
  })

  test('should call peekMessages twice if messages on first call', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(mockPeekMessages).toHaveBeenCalledTimes(2)
  })

  test('should call sleep once if messages on first call', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(mockSleep).toHaveBeenCalledTimes(1)
  })

  test('should call sleep with interval if messages on first call', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')
    const config = require('../../../app/config/message')

    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(mockSleep).toHaveBeenCalledWith(config.idleCheckInterval)
  })

  test('should call peekMessages twice if messages on first call and not all messages have more than one delivery attempt', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 },
      { deliveryCount: 2 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(mockPeekMessages).toHaveBeenCalledTimes(2)
  })

  test('should call sleep once if messages on first call and not all messages have more than one delivery attempt', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 },
      { deliveryCount: 2 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(mockSleep).toHaveBeenCalledTimes(1)
  })

  test('should log info when waiting for messages to become idle', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(consoleInfoSpy).toHaveBeenCalledWith('TestProcess processing paused - waiting for 1 messages to be idle on topic test-topic')
  })

  test('should close connection', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    await waitForIdleSubscription(subscription, processName)
    expect(mockCloseConnection).toHaveBeenCalled()
  })

  test('should call dataProcessingAlert and close connection when peekMessages throws', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    const peekErr = new Error('test error')
    mockPeekMessages.mockRejectedValue(peekErr)
    mockDataProcessingAlert.mockResolvedValue()

    await expect(waitForIdleSubscription(subscription, processName)).rejects.toThrow('test error')

    expect(mockDataProcessingAlert).toHaveBeenCalledWith({
      process: 'waitForIdleSubscription',
      processName,
      error: peekErr,
      message: `Error waiting for idle subscription on topic ${subscription.topic}`
    }, expect.anything())
    expect(consoleErrorSpy).toHaveBeenCalledWith(peekErr)
    expect(mockCloseConnection).toHaveBeenCalled()
  })

  test('should log alert error if dataProcessingAlert throws', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    const peekErr = new Error('test error')
    const error = new Error('alert error')
    mockPeekMessages.mockRejectedValue(peekErr)
    mockDataProcessingAlert.mockRejectedValue(error)

    await expect(waitForIdleSubscription(subscription, processName)).rejects.toThrow('test error')

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2)
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, peekErr)
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, `Error detected at: ${processName}`, error)
    expect(mockCloseConnection).toHaveBeenCalled()
  })

  test('should log close error when closeConnection throws', async () => {
    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    const error = new Error('close error')
    mockCloseConnection.mockRejectedValue(error)

    await expect(waitForIdleSubscription(subscription, processName)).resolves.toBeUndefined()
    expect(consoleErrorSpy).toHaveBeenCalledWith(error)
  })

  test('should not attempt to close connection if MessageReceiver constructor throws', async () => {
    jest.resetModules()
    jest.clearAllMocks()

    const ctorErr = new Error('ctor error')
    jest.doMock('ffc-messaging', () => ({
      MessageReceiver: jest.fn().mockImplementation(() => {
        throw ctorErr
      })
    }))

    jest.doMock('../../../app/messaging/sleep', () => mockSleep)
    jest.doMock('ffc-alerting-utils', () => ({
      dataProcessingAlert: mockDataProcessingAlert
    }))

    const consoleInfo = jest.spyOn(console, 'info').mockImplementation(() => {})
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    mockDataProcessingAlert.mockResolvedValue()

    const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

    await expect(waitForIdleSubscription(subscription, processName)).rejects.toThrow('ctor error')

    expect(mockCloseConnection).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalledWith(ctorErr)

    consoleInfo.mockRestore()
    consoleError.mockRestore()
  })
})
