const { processingConfig } = require('../config')
const waitForIdleMessaging = require('../messaging/wait-for-idle-messaging')
const processPaymentSchedules = require('./process-payment-schedules')
const processStatements = require('./process-statements')

const start = async () => {
  try {
    if (processingConfig.statementConstructionActive) {
      await waitForIdleMessaging()
      await processStatements()
    }
    if (processingConfig.scheduleConstructionActive) {
      await waitForIdleMessaging()
      await processPaymentSchedules()
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.settlementProcessingInterval)
  }
}

module.exports = { start }
