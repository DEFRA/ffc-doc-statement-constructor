const waitForIdleSubscription = require('./wait-for-idle-subscription')

const waitForIdleMessaging = async (subscriptions, processName, options = {}) => {
  if (options.bypass || process.env.BYPASS_IDLE_CHECK === 'true') {
    console.info(`${processName}: Bypassing idle check to process backlog`)
    return true
  }

  const skipTimeoutCheck = options.blockProcessing === false

  for (const subscription of subscriptions) {
    try {
      const isIdle = await waitForIdleSubscription(subscription, processName)

      if (!isIdle && !skipTimeoutCheck) {
        return false
      }
    } catch (err) {
      if (!skipTimeoutCheck) {
        console.error(`${processName} idle check failed:`, err)
        return false
      }

      console.warn(`${processName} idle check failed but continuing:`, err)
    }
  }

  return true
}

module.exports = waitForIdleMessaging
