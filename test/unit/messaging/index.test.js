jest.mock('ffc-messaging')
jest.mock('../../../app/data')
const { MessageReceiver } = require('ffc-messaging')
const messageService = require('../../../app/messaging')
const config = require('../../../app/config')

const throughputOptions = {
  preFetchMessages: 250,
  maxConcurrentMessages: 25,
  receiveBatchSize: 20,
  processingTimeoutInMs: 30000
}

describe('messaging', () => {
  let mockSubscribe
  let mockCloseConnection

  beforeEach(() => {
    jest.clearAllMocks()

    mockSubscribe = jest.fn().mockResolvedValue()
    mockCloseConnection = jest.fn().mockResolvedValue()

    MessageReceiver.mockImplementation(() => ({
      subscribe: mockSubscribe,
      closeConnection: mockCloseConnection
    }))
  })

  afterAll(async () => {
    await messageService.stop()
  })

  test('start creates both statementDataReceiver and retentionReceiver with correct params and subscribes', async () => {
    await messageService.start()

    expect(MessageReceiver).toHaveBeenCalledTimes(2)

    expect(MessageReceiver).toHaveBeenNthCalledWith(
      1,
      config.statementDataSubscription,
      expect.any(Function),
      throughputOptions
    )

    expect(MessageReceiver).toHaveBeenNthCalledWith(
      2,
      config.retentionSubscription,
      expect.any(Function)
    )

    expect(mockSubscribe).toHaveBeenCalledTimes(2)
  })

  test('stop closes connections for both receivers', async () => {
    await messageService.start()
    await messageService.stop()

    expect(mockCloseConnection).toHaveBeenCalledTimes(2)
  })
})
