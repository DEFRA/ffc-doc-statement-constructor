const waitForIdleSubscription = require('./wait-for-idle-subscription')

const waitForIdleMessaging = async (subscriptions, processName) => {
  await Promise.all(subscriptions.map(subscription => waitForIdleSubscription(subscription, processName)))
}

module.exports = waitForIdleMessaging
