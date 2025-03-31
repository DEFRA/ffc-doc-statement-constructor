const config = require('../config')
const processStatementDataMessage = require('./process-statement-data-message')
const { MessageReceiver } = require('ffc-messaging')

let statementDataReceiver

const start = async () => {
  try {
    console.info('[MESSAGING] Setting up message processing')

    // Simple direct handler - no batch processor complexity
    const handleMessage = async (message) => {
      console.log(`[PROCESSING] Received message: ${message.body?.type || 'unknown'} - ID: ${message.body?.id || 'unknown'}`)

      try {
        await processStatementDataMessage(message, statementDataReceiver)
        console.log(`[PROCESSING] Successfully processed message: ${message.body?.id || 'unknown'}`)
      } catch (err) {
        console.error(`[PROCESSING] Error processing message ${message.body?.id || 'unknown'}:`, err)
        // Don't rethrow - we want to keep processing other messages
      }
    }

    // Create a receiver with the direct handler
    statementDataReceiver = new MessageReceiver(config.statementDataSubscription, handleMessage)
    await statementDataReceiver.subscribe()

    console.info('[MESSAGING] Statement data receiver subscribed and processing messages')

    // Periodically log stats
    setInterval(() => {
      const memoryUsage = process.memoryUsage()
      console.info(`[MONITORING] Memory usage - RSS: ${Math.round(memoryUsage.rss / 1024 / 1024)} MB, Heap: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}/${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`)
    }, 60000)

    console.info('[MESSAGING] Message processing system ready')
  } catch (error) {
    console.error('[MESSAGING] Critical error in setup:', error)
    throw error
  }
}

const stop = async () => {
  console.info('[MESSAGING] Shutting down message processing...')

  try {
    if (statementDataReceiver) {
      await statementDataReceiver.closeConnection()
    }
    console.info('[MESSAGING] All receivers closed successfully')
  } catch (error) {
    console.error('[MESSAGING] Error during shutdown:', error)
  }
}

module.exports = { start, stop }
