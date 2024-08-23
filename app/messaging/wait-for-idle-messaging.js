const waitForIdleSubscription = require('./wait-for-idle-subscription')

const waitForIdleMessaging = async (subscriptions) => {
  await Promise.all(subscriptions.map(subscription => waitForIdleSubscription(subscription)))
}

module.exports = waitForIdleMessaging
