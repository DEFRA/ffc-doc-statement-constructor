const { processingConfig } = require('../config')
const messageConfig = require('../config/message')
const waitForIdleMessaging = require('../messaging/wait-for-idle-messaging')
const processSfi23QuarterlyStatement = require('./process-sfi-23-quarterly-statements')
const processDelinkedStatement = require('./process-delinked-payment-statements')

const processTask = async (subscriptions, processFunction, processName) => {
  await waitForIdleMessaging(subscriptions, processName)
  await processFunction()
}

const start = async () => {
  const tasks = []

  if (processingConfig.sfi23QuarterlyStatementProcessingActive) {
    const relatedSubscriptions = [messageConfig.statementDataSubscription]
    tasks.push(() => processTask(relatedSubscriptions, processSfi23QuarterlyStatement, 'SFI23 Quarterly Statement'))
  }

  if (!processingConfig.delinkedStatementProcessingActive) {
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
    setTimeout(start, processingConfig.statementProcessingInterval)
  }
}

module.exports = { start }
