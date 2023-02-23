jest.mock('../../../app/messaging/wait-for-idle-subscription')
const waitForIdleSubscription = require('../../../app/messaging/wait-for-idle-subscription')

const waitForIdleMessaging = require('../../../app/messaging/wait-for-idle-messaging')

const config = require('../../../app/config/message')

describe('wait for idle messaging', () => {
  test('should call waitForIdleSubscription for each subscription', async () => {
    await waitForIdleMessaging()
    expect(waitForIdleSubscription).toHaveBeenCalledTimes(4)
  })

  test('should call waitForIdleSubscription with processing subscription', async () => {
    await waitForIdleMessaging()
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.processingSubscription)
  })

  test('should call waitForIdleSubscription with submit subscription', async () => {
    await waitForIdleMessaging()
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.submitSubscription)
  })

  test('should call waitForIdleSubscription with return subscription', async () => {
    await waitForIdleMessaging()
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.returnSubscription)
  })

  test('should call waitForIdleSubscription with statement data subscription', async () => {
    await waitForIdleMessaging()
    expect(waitForIdleSubscription).toHaveBeenCalledWith(config.statementDataSubscription)
  })
})
