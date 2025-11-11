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
  afterAll(async () => {
    await messageService.stop()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test.each([
    [true, 1, 'starts message receivers when paymentLinkActive is true'],
    [false, 1, 'starts only statement data receiver when paymentLinkActive is false']
  ])('%s', async (paymentLinkActive, expectedCalls, _description) => {
    config.paymentLinkActive = paymentLinkActive

    await messageService.start()

    expect(MessageReceiver).toHaveBeenCalledTimes(expectedCalls)
    expect(MessageReceiver).toHaveBeenCalledWith(
      config.statementDataSubscription,
      expect.any(Function),
      throughputOptions
    )
  })
})
