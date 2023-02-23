const config = require('../config/message')
const waitForIdleSubscription = require('./wait-for-idle-subscription')

const waitForIdleMessaging = async () => {
  await Promise.all(getSubscriptions().map(subscription => waitForIdleSubscription(subscription)))
}

const getSubscriptions = () => {
  return [config.processingSubscription, config.submitSubscription, config.returnSubscription, config.statementDataSubscription]
}

module.exports = waitForIdleMessaging
