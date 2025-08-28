const mockPeekMessages = jest.fn()
const mockCloseConnection = jest.fn()
jest.mock('ffc-messaging', () => {
  return {
    MessageReceiver: jest.fn().mockImplementation(() => {
      return {
        peekMessages: mockPeekMessages,
        closeConnection: mockCloseConnection
      }
    })
  }
})
jest.mock('../../../app/messaging/sleep')
const sleep = require('../../../app/messaging/sleep')
jest.mock('../../../app/utility/processing-alerts', () => ({
  dataProcessingAlert: jest.fn()
}))
const { dataProcessingAlert } = require('../../../app/utility/processing-alerts')
const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')
const config = require('../../../app/config/message')
const subscription = {
  topic: 'test-topic'
}
describe('wait for idle subscription', () => {
  const processName = 'TestProcess'
  let consoleInfoSpy
  let consoleErrorSpy
  beforeEach(() => {
    jest.clearAllMocks()
    mockPeekMessages.mockResolvedValue([])
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterAll(() => {
    consoleInfoSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })
  test('should call peekMessages with batch size', async () => {
    await waitForIdleSubscription(subscription, processName)
    expect(mockPeekMessages).toHaveBeenCalledWith(config.idleCheckBatchSize, { fromSequenceNumber: expect.anything() })
  })
  test('should call peekMessages once if no messages', async () => {
    await waitForIdleSubscription(subscription, processName)
    expect(mockPeekMessages).toHaveBeenCalledTimes(1)
  })
  test('should not call sleep if no messages', async () => {
    await waitForIdleSubscription(subscription, processName)
    expect(sleep).not.toHaveBeenCalled()
  })
  test('should call peekMessages once if all messages have more than one delivery attempt', async () => {
    mockPeekMessages.mockResolvedValue([
      { deliveryCount: 2 }
    ])
    await waitForIdleSubscription(subscription, processName)
    expect(mockPeekMessages).toHaveBeenCalledTimes(1)
  })
  test('should not call sleep if all messages have more than one delivery attempt', async () => {
    mockPeekMessages.mockResolvedValue([
      { deliveryCount: 2 }
    ])
    await waitForIdleSubscription(subscription, processName)
    expect(sleep).not.toHaveBeenCalled()
  })
  test('should call peekMessages twice if messages on first call', async () => {
    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(mockPeekMessages).toHaveBeenCalledTimes(2)
  })
  test('should call sleep once if messages on first call', async () => {
    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(sleep).toHaveBeenCalledTimes(1)
  })
  test('should call sleep with interval if messages on first call', async () => {
    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(sleep).toHaveBeenCalledWith(config.idleCheckInterval)
  })
  test('should call peekMessages twice if messages on first call and not all messages have more than one delivery attempt', async () => {
    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 },
      { deliveryCount: 2 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(mockPeekMessages).toHaveBeenCalledTimes(2)
  })
  test('should call sleep once if messages on first call and not all messages have more than one delivery attempt', async () => {
    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 },
      { deliveryCount: 2 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(sleep).toHaveBeenCalledTimes(1)
  })
  test('should log info when waiting for messages to become idle', async () => {
    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription, processName)
    expect(consoleInfoSpy).toHaveBeenCalledWith('TestProcess processing paused - waiting for 1 messages to be idle on topic test-topic')
  })
  test('should close connection', async () => {
    await waitForIdleSubscription(subscription, processName)
    expect(mockCloseConnection).toHaveBeenCalled()
  })
  test('should call dataProcessingAlert and close connection when peekMessages throws', async () => {
    const peekErr = new Error('test error')
    mockPeekMessages.mockRejectedValue(peekErr)
    dataProcessingAlert.mockResolvedValue()
    await expect(waitForIdleSubscription(subscription, processName)).rejects.toThrow('test error')
    expect(dataProcessingAlert).toHaveBeenCalledWith({
      process: 'waitForIdleSubscription',
      processName,
      error: peekErr,
      message: `Error waiting for idle subscription on topic ${subscription.topic}`
    }, expect.anything())
    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(mockCloseConnection).toHaveBeenCalled()
  })
  test('should log alert error if dataProcessingAlert throws', async () => {
    const peekErr = new Error('test error')
    const alertErr = new Error('alert error')
    mockPeekMessages.mockRejectedValue(peekErr)
    dataProcessingAlert.mockRejectedValue(alertErr)
    await expect(waitForIdleSubscription(subscription, processName)).rejects.toThrow('test error')
    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error detected at: ${processName}`, alertErr)
    expect(mockCloseConnection).toHaveBeenCalled()
  })
})
