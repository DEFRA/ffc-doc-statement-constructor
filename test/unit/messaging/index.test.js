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

  test('starts message receivers when paymentLinkActive is true', async () => {
    config.paymentLinkActive = true

    await messageService.start()

    expect(MessageReceiver).toHaveBeenCalledTimes(1)
    expect(MessageReceiver).toHaveBeenCalledWith(config.statementDataSubscription, expect.any(Function), throughputOptions)
  })

  test('starts only statement data receiver when paymentLinkActive is false', async () => {
    config.paymentLinkActive = false

    await messageService.start()

    expect(MessageReceiver).toHaveBeenCalledTimes(1)
    expect(MessageReceiver).toHaveBeenCalledWith(config.statementDataSubscription, expect.any(Function), throughputOptions)
  })
})
