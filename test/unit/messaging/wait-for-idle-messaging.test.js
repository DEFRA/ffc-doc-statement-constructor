jest.mock('../../../app/messaging/wait-for-idle-subscription')
const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

const waitForIdleMessaging = require('../../../app/messaging/wait-for-idle-messaging')

const config = require('../../../app/config/message')

describe('wait for idle messaging', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })
  test('should call waitForIdleSubscription for each subscription in the list of subscriptions provided', async () => {
    const relatedSubscriptions = [config.processingSubscription, config.submitSubscription, config.returnSubscription, config.statementDataSubscription]
    await waitForIdleMessaging(relatedSubscriptions)
    expect(waitForIdleSubscription).toHaveBeenCalledTimes(4)
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.processingSubscription)
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.submitSubscription)
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.returnSubscription)
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.statementDataSubscription)
  })

  test('should call waitForIdleSubscription for only the subscriptions in the list of subscriptions provided', async () => {
    const relatedSubscriptions = [config.returnSubscription, config.statementDataSubscription]
    await waitForIdleMessaging(relatedSubscriptions)
    expect(waitForIdleSubscription).toHaveBeenCalledTimes(2)
    expect(waitForIdleSubscription).not.toHaveBeenCalledWith(config.processingSubscription)
    expect(waitForIdleSubscription).not.toHaveBeenCalledWith(config.submitSubscription)
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.returnSubscription)
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.statementDataSubscription)
  })
})
