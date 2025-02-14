const { processingConfig, paymentLinkActive } = require('../config')
const messageConfig = require('../config/message')
const waitForIdleMessaging = require('../messaging/wait-for-idle-messaging')
const processSfi23QuarterlyStatement = require('./process-sfi-23-quarterly-statements')
const processSfi23AdvancedStatement = require('./process-sfi-23-advanced-statements')
const processDelinkedStatement = require('./process-delinked-payment-statements')

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

  if (processingConfig.sfi23AdvancedStatementConstructionActive) {
    const relatedSubscriptions = [messageConfig.statementDataSubscription]
    if (paymentLinkActive) {
      relatedSubscriptions.push(messageConfig.processingSubscription)
      relatedSubscriptions.push(messageConfig.submitSubscription)
      relatedSubscriptions.push(messageConfig.returnSubscription)
    }
    tasks.push(() => processTask(relatedSubscriptions, processSfi23AdvancedStatement, 'SFI23 Advance Statement'))
  }

  if (!processingConfig.delinkedPaymentStatementActive) {
    console.log('Delinked Payment Statement processing is disabled')
  } else {
    const relatedSubscriptions = [messageConfig.statementDataSubscription]
    tasks.push(() => processTask(relatedSubscriptions, processDelinkedStatement, 'Delinked Payment Statement'))
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
