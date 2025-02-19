jest.mock('ffc-messaging')
jest.mock('../../../app/data')
const { MessageReceiver } = require('ffc-messaging')
const messageService = require('../../../app/messaging')
const config = require('../../../app/config')

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

    expect(MessageReceiver).toHaveBeenCalledTimes(4)
    expect(MessageReceiver).toHaveBeenCalledWith(config.processingSubscription, expect.any(Function))
    expect(MessageReceiver).toHaveBeenCalledWith(config.submitSubscription, expect.any(Function))
    expect(MessageReceiver).toHaveBeenCalledWith(config.returnSubscription, expect.any(Function))
    expect(MessageReceiver).toHaveBeenCalledWith(config.statementDataSubscription, expect.any(Function))
  })

  test('starts only statement data receiver when paymentLinkActive is false', async () => {
    config.paymentLinkActive = false

    await messageService.start()

    expect(MessageReceiver).toHaveBeenCalledTimes(1)
    expect(MessageReceiver).toHaveBeenCalledWith(config.statementDataSubscription, expect.any(Function))
  })
})
