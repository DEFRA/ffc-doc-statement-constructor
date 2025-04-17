jest.mock('../../../app/messaging/wait-for-idle-subscription')
const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

const waitForIdleMessaging = require('../../../app/messaging/wait-for-idle-messaging')

const config = require('../../../app/config/message')

describe('wait for idle messaging', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  test('should call waitForIdleSubscription for each subscription in the list of subscriptions provided', async () => {
    const relatedSubscriptions = [config.statementDataSubscription]
    await waitForIdleMessaging(relatedSubscriptions, 'Statement Name')
    expect(waitForIdleSubscription).toHaveBeenCalledTimes(1)
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.statementDataSubscription, 'Statement Name')
  })

  test('should not call waitForIdleSubscription if the list of subscriptions provided is empty', async () => {
    const relatedSubscriptions = []
    await waitForIdleMessaging(relatedSubscriptions, 'Statement Name')
    expect(waitForIdleSubscription).not.toHaveBeenCalled()
  })
})
