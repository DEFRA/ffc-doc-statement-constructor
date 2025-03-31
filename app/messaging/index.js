const config = require('../config')
const processProcessingMessage = require('./process-processing-message')
const processSubmitMessage = require('./process-submit-message')
const processReturnMessage = require('./process-return-message')
const processStatementDataMessageBatch = require('./process-statement-data-message-batch')
const { MessageReceiver } = require('ffc-messaging')
const MessageBatchProcessor = require('./batch-processor')

let processingReceiver
let submitReceiver
let returnReceiver
let statementDataReceiver
let statementDataBatchProcessor

const start = async () => {
  if (config.paymentLinkActive) {
    console.info('Payment messages active')
    try {
      const processingAction = message => processProcessingMessage(message, processingReceiver)
      processingReceiver = new MessageReceiver(config.processingSubscription, processingAction)
      await processingReceiver.subscribe()

      const submitAction = message => processSubmitMessage(message, submitReceiver)
      submitReceiver = new MessageReceiver(config.submitSubscription, submitAction)
      await submitReceiver.subscribe()

      const returnAction = message => processReturnMessage(message, returnReceiver)
      returnReceiver = new MessageReceiver(config.returnSubscription, returnAction)
      await returnReceiver.subscribe()
    } catch (error) {
      console.error('Error setting up payment message receivers:', error)
      throw error
    }
  }

  try {
    const noopHandler = () => { }
    statementDataReceiver = new MessageReceiver(config.statementDataSubscription, noopHandler)
    await statementDataReceiver.subscribe()
    statementDataBatchProcessor = new MessageBatchProcessor(
      statementDataReceiver,
      processStatementDataMessageBatch
    )

    const initialized = statementDataBatchProcessor.initialize()
    if (!initialized) {
      console.warn('Statement data batch processor could not initialize properly')
    }

    setInterval(() => {
      const memoryUsage = process.memoryUsage()
      console.info(`Memory usage - RSS: ${Math.round(memoryUsage.rss / 1024 / 1024)} MB, Heap: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}/${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`)
    }, 120000)

    console.info('Ready to receive payment updates')
  } catch (error) {
    console.error('Error setting up statement data receiver:', error)
    throw error
  }
}

const stop = async () => {
  if (processingReceiver) await processingReceiver.closeConnection()
  if (submitReceiver) await submitReceiver.closeConnection()
  if (returnReceiver) await returnReceiver.closeConnection()
  if (statementDataReceiver) await statementDataReceiver.closeConnection()
}

module.exports = { start, stop }
