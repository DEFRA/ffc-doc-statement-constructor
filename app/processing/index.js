const { processingConfig } = require('../config')
const messageConfig = require('../config/message')
const waitForIdleMessaging = require('../messaging/wait-for-idle-messaging')
const processPaymentSchedules = require('./process-payment-schedules')
const processStatements = require('./process-statements')
const processSfi23QuarterlyStatement = require('./process-sfi-23-quarterly-statements')
const processSfi23AdvancedStatement = require('./process-sfi-23-advanced-statements')

const processTask = async (subscriptions, processFunction, processName) => {
  await waitForIdleMessaging(subscriptions, processName)
  await processFunction()
}

const start = async () => {
  const tasks = []

  if (processingConfig.sfi23QuarterlyStatementConstructionActive) {
    const relatedSubscriptions = [messageConfig.statementDataSubscription]
    tasks.push(() => processTask(relatedSubscriptions, processSfi23QuarterlyStatement, 'SFI23 Quarterly Statement'))
  }

  if (processingConfig.statementConstructionActive) {
    const relatedSubscriptions = [messageConfig.processingSubscription, messageConfig.submitSubscription, messageConfig.returnSubscription, messageConfig.statementDataSubscription]
    tasks.push(() => processTask(relatedSubscriptions, processStatements, 'SFI22 Quarterly Statement'))
  }

  if (processingConfig.sfi23AdvancedStatementConstructionActive) {
    const relatedSubscriptions = [messageConfig.processingSubscription, messageConfig.submitSubscription, messageConfig.returnSubscription, messageConfig.statementDataSubscription]
    tasks.push(() => processTask(relatedSubscriptions, processSfi23AdvancedStatement, 'SFI23 Advance Statement'))
  }

  if (processingConfig.scheduleConstructionActive) {
    const relatedSubscriptions = [messageConfig.processingSubscription, messageConfig.submitSubscription, messageConfig.returnSubscription, messageConfig.statementDataSubscription]
    tasks.push(() => processTask(relatedSubscriptions, processPaymentSchedules, 'SFI22 Schedule'))
  }

  try {
    await Promise.all(tasks.map(task => task()))
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.settlementProcessingInterval)
  }
}

module.exports = { start }
