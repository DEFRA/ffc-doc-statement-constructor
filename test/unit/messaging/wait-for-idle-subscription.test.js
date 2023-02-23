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

const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')
const config = require('../../../app/config/message')

const subscription = {
  topic: 'test-topic'
}

describe('wait for idle subscription', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPeekMessages.mockResolvedValue([])
  })

  test('should call peekMessages with batch size', async () => {
    await waitForIdleSubscription(subscription)
    expect(mockPeekMessages).toHaveBeenCalledWith(config.idleCheckBatchSize, { fromSequenceNumber: expect.anything() })
  })

  test('should call peekMessages once if no messages', async () => {
    await waitForIdleSubscription(subscription)
    expect(mockPeekMessages).toHaveBeenCalledTimes(1)
  })

  test('should not call sleep if no messages', async () => {
    await waitForIdleSubscription(subscription)
    expect(sleep).not.toHaveBeenCalled()
  })

  test('should call peekMessages once if all messages have more than one delivery attempt', async () => {
    mockPeekMessages.mockResolvedValue([
      { deliveryCount: 2 }
    ])
    await waitForIdleSubscription(subscription)
    expect(mockPeekMessages).toHaveBeenCalledTimes(1)
  })

  test('should not call sleep if all messages have more than one delivery attempt', async () => {
    mockPeekMessages.mockResolvedValue([
      { deliveryCount: 2 }
    ])
    await waitForIdleSubscription(subscription)
    expect(sleep).not.toHaveBeenCalled()
  })

  test('should call peekMessages twice if messages on first call', async () => {
    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription)
    expect(mockPeekMessages).toHaveBeenCalledTimes(2)
  })

  test('should call sleep once if messages on first call', async () => {
    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription)
    expect(sleep).toHaveBeenCalledTimes(1)
  })

  test('should call sleep with interval if messages on first call', async () => {
    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription)
    expect(sleep).toHaveBeenCalledWith(config.idleCheckInterval)
  })

  test('should call peekMessages twice if messages on first call and not all messages have more than one delivery attempt', async () => {
    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 },
      { deliveryCount: 2 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription)
    expect(mockPeekMessages).toHaveBeenCalledTimes(2)
  })

  test('should call sleep once if messages on first call and not all messages have more than one delivery attempt', async () => {
    mockPeekMessages.mockResolvedValueOnce([
      { deliveryCount: 1 },
      { deliveryCount: 2 }
    ])
    mockPeekMessages.mockResolvedValueOnce([])
    await waitForIdleSubscription(subscription)
    expect(sleep).toHaveBeenCalledTimes(1)
  })

  test('should close connection', async () => {
    await waitForIdleSubscription(subscription)
    expect(mockCloseConnection).toHaveBeenCalled()
  })

  test('should close connection if peekMessages throws', async () => {
    mockPeekMessages.mockRejectedValue(new Error('test error'))
    try {
      await waitForIdleSubscription(subscription)
    } catch (err) {
      expect(mockCloseConnection).toHaveBeenCalled()
    }
  })
})
