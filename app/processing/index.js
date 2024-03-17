const { processingConfig } = require('../config')
const waitForIdleMessaging = require('../messaging/wait-for-idle-messaging')
const processPaymentSchedules = require('./process-payment-schedules')
const processStatements = require('./process-statements')
const processSfi23QuarterlyStatement = require('./process-sfi-23-quarterly-statements')

const start = async () => {
  try {
    if (processingConfig.sfi23QuarterlyStatementConstructionActive) {
      await waitForIdleMessaging()
      await processSfi23QuarterlyStatement()
    }
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
