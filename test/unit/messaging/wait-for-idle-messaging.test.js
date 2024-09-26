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
    await waitForIdleMessaging(relatedSubscriptions, 'Statement Name')
    expect(waitForIdleSubscription).toHaveBeenCalledTimes(4)
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.processingSubscription, 'Statement Name')
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.submitSubscription, 'Statement Name')
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.returnSubscription, 'Statement Name')
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.statementDataSubscription, 'Statement Name')
  })

  test('should call waitForIdleSubscription for only the subscriptions in the list of subscriptions provided', async () => {
    const relatedSubscriptions = [config.returnSubscription, config.statementDataSubscription]
    await waitForIdleMessaging(relatedSubscriptions, 'Statement Name')
    expect(waitForIdleSubscription).toHaveBeenCalledTimes(2)
    expect(waitForIdleSubscription).not.toHaveBeenCalledWith(config.processingSubscription, 'Statement Name')
    expect(waitForIdleSubscription).not.toHaveBeenCalledWith(config.submitSubscription, 'Statement Name')
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.returnSubscription, 'Statement Name')
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.statementDataSubscription, 'Statement Name')
  })
})
