const { processingConfig } = require('../config')
const messageConfig = require('../config/message')
const waitForIdleMessaging = require('../messaging/wait-for-idle-messaging')
const processPaymentSchedules = require('./process-payment-schedules')
const processStatements = require('./process-statements')
const processSfi23QuarterlyStatement = require('./process-sfi-23-quarterly-statements')

const start = async () => {
  try {
    if (processingConfig.sfi23QuarterlyStatementConstructionActive) {
      const relatedSubscriptions = [messageConfig.statementDataSubscription]
      await waitForIdleMessaging(relatedSubscriptions)
      await processSfi23QuarterlyStatement()
    }
    if (processingConfig.statementConstructionActive) {
      const relatedSubscriptions = [messageConfig.processingSubscription, messageConfig.submitSubscription, messageConfig.returnSubscription, messageConfig.statementDataSubscription]
      await waitForIdleMessaging(relatedSubscriptions)
      await processStatements()
    }
    if (processingConfig.scheduleConstructionActive) {
      const relatedSubscriptions = [messageConfig.processingSubscription, messageConfig.submitSubscription, messageConfig.returnSubscription, messageConfig.statementDataSubscription]
      await waitForIdleMessaging(relatedSubscriptions)
      await processPaymentSchedules()
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.settlementProcessingInterval)
  }
}

module.exports = { start }
