const { processingConfig, paymentLinkActive } = require('../config')
const messageConfig = require('../config/message')
const waitForIdleMessaging = require('../messaging/wait-for-idle-messaging')
const processSfi23QuarterlyStatement = require('./process-sfi-23-quarterly-statements')
const processSfi23AdvancedStatement = require('./process-sfi-23-advanced-statements')
const processDelinkedStatement = require('./process-delinked-payment-statements')

const processTask = async (subscriptions, processFunction, processName) => {
  const isIdle = await waitForIdleMessaging(subscriptions, processName, { timeout: 30000, blockProcessing: false })
  if (!isIdle) {
    console.log(`${processName} no active messages in queue`)
  }
  await processFunction()
}

const start = async () => {
  if (processingConfig.sfi23QuarterlyStatementConstructionActive) {
    startProcessor('SFI23 Quarterly', async () => {
      const relatedSubscriptions = [messageConfig.statementDataSubscription]
      await processTask(relatedSubscriptions, processSfi23QuarterlyStatement, 'SFI23 Quarterly Statement')
    })
  }

  if (processingConfig.sfi23AdvancedStatementConstructionActive) {
    startProcessor('SFI23 Advanced', async () => {
      const relatedSubscriptions = [messageConfig.statementDataSubscription]
      if (paymentLinkActive) {
        relatedSubscriptions.push(messageConfig.processingSubscription)
        relatedSubscriptions.push(messageConfig.submitSubscription)
        relatedSubscriptions.push(messageConfig.returnSubscription)
      }
      await processTask(relatedSubscriptions, processSfi23AdvancedStatement, 'SFI23 Advance Statement')
    })
  }

  if (processingConfig.delinkedPaymentStatementActive) {
    startProcessor('Delinked Payment', async () => {
      const relatedSubscriptions = [messageConfig.statementDataSubscription]
      await processTask(relatedSubscriptions, processDelinkedStatement, 'Delinked Payment Statement')
    })
  }
}

const startProcessor = (name, processorFn) => {
  let running = false

  const runProcessor = async () => {
    if (running) return
    running = true

    try {
      await processorFn()
    } catch (err) {
      console.error(`Error in ${name} processor:`, err)
    } finally {
      running = false
      setTimeout(runProcessor, processingConfig.settlementProcessingInterval)
    }
  }

  runProcessor()
}

module.exports = { start }
