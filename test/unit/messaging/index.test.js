const { start, stop } = require('../../../app/messaging')
const { MessageReceiver } = require('ffc-messaging')
const config = require('../../../app/config')

jest.mock('ffc-messaging')

describe('messaging', () => {
  let mockSubscribe
  let mockCloseConnection
  let messageReceiverMock
  let originalConsoleError
  let originalConsoleInfo

  beforeEach(() => {
    mockSubscribe = jest.fn()
    mockCloseConnection = jest.fn()

    messageReceiverMock = {
      subscribe: mockSubscribe,
      closeConnection: mockCloseConnection
    }

    MessageReceiver.mockImplementation(() => messageReceiverMock)

    originalConsoleError = console.error
    originalConsoleInfo = console.info

    console.error = jest.fn()
    console.info = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()

    console.error = originalConsoleError
    console.info = originalConsoleInfo
  })

  test('starts message receiver', async () => {
    await start()

    expect(MessageReceiver).toHaveBeenCalledTimes(1)
    expect(MessageReceiver).toHaveBeenCalledWith(config.statementDataSubscription, expect.any(Function))
  })

  test('start() should set up message processing and subscribe', async () => {
    await start()

    expect(console.info).toHaveBeenCalledWith('[MESSAGING] Setting up message processing')
    expect(mockSubscribe).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalledWith('[MESSAGING] Statement data receiver subscribed and processing messages')
    expect(console.info).toHaveBeenCalledWith('[MESSAGING] Message processing system ready')
  })

  test('start() should log an error if setup fails', async () => {
    mockSubscribe.mockRejectedValueOnce(new Error('Subscribe failed'))

    await expect(start()).rejects.toThrow('Subscribe failed')
    expect(console.error).toHaveBeenCalledWith('[MESSAGING] Critical error in setup:', expect.any(Error))
  })

  test('stop() should close all receivers successfully', async () => {
    await start()
    await stop()

    expect(mockCloseConnection).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalledWith('[MESSAGING] All receivers closed successfully')
  })

  test('stop() should log an error if shutdown fails', async () => {
    await start()

    mockCloseConnection.mockRejectedValueOnce(new Error('Close connection failed'))

    await stop()

    expect(console.error).toHaveBeenCalledWith('[MESSAGING] Error during shutdown:', expect.any(Error))
  })
})
