jest.mock('../../../app/messaging/service-bus')
jest.mock('../../../app/data')
const serviceBus = require('../../../app/messaging/service-bus')
const messageService = require('../../../app/messaging')
const config = require('../../../app/config')

describe('messaging', () => {
  let mockSbClient
  let mockStatementReceiver
  let mockRetentionReceiver

  beforeEach(() => {
    jest.clearAllMocks()

    mockSbClient = { close: jest.fn().mockResolvedValue() }
    mockStatementReceiver = { close: jest.fn().mockResolvedValue() }
    mockRetentionReceiver = { close: jest.fn().mockResolvedValue() }

    serviceBus.createServiceBusClient.mockReturnValue(mockSbClient)
    serviceBus.createReceiver
      .mockReturnValueOnce(mockStatementReceiver)
      .mockReturnValueOnce(mockRetentionReceiver)
    serviceBus.subscribeReceiver.mockReturnValue()
    serviceBus.closeSenders.mockResolvedValue()
  })

  afterAll(async () => {
    await messageService.stop()
  })

  test('start creates Service Bus client and receivers with correct params and subscribes', async () => {
    await messageService.start()

    expect(serviceBus.createServiceBusClient).toHaveBeenCalledTimes(1)

    expect(serviceBus.createReceiver).toHaveBeenCalledTimes(2)
    expect(serviceBus.createReceiver).toHaveBeenNthCalledWith(1, mockSbClient, config.statementDataSubscription)
    expect(serviceBus.createReceiver).toHaveBeenNthCalledWith(2, mockSbClient, config.retentionSubscription)

    expect(serviceBus.subscribeReceiver).toHaveBeenCalledTimes(2)
    expect(serviceBus.subscribeReceiver).toHaveBeenNthCalledWith(1, mockStatementReceiver, expect.any(Function), expect.any(Function), config.statementDataSubscription)
    expect(serviceBus.subscribeReceiver).toHaveBeenNthCalledWith(2, mockRetentionReceiver, expect.any(Function), expect.any(Function), config.retentionSubscription)
  })

  test('stop closes senders and receiver connections', async () => {
    await messageService.start()
    await messageService.stop()

    expect(serviceBus.closeSenders).toHaveBeenCalledTimes(1)
    expect(mockStatementReceiver.close).toHaveBeenCalledTimes(1)
    expect(mockRetentionReceiver.close).toHaveBeenCalledTimes(1)
    expect(mockSbClient.close).toHaveBeenCalledTimes(1)
  })
})
