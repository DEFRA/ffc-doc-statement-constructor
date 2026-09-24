const config = require('../config')
const { createServiceBusClient, createReceiver, subscribeReceiver, closeSenders } = require('./service-bus')
const processStatementDataMessage = require('./process-statement-data-message')
const { processRetentionMessage } = require('./process-retention-message')
const errorHandler = (error) => {
  console.error('Error occurred:', error)
}

let sbClient
let statementDataReceiver
let retentionReceiver

const start = async () => {
  sbClient = createServiceBusClient(config.statementDataSubscription)
  statementDataReceiver = createReceiver(sbClient, config.statementDataSubscription)
  subscribeReceiver(statementDataReceiver, processStatementDataMessage, errorHandler, config.statementDataSubscription)
  console.info('Ready to receive statement data updates')

  retentionReceiver = createReceiver(sbClient, config.retentionSubscription)
  subscribeReceiver(retentionReceiver, processRetentionMessage, errorHandler, config.retentionSubscription)
  console.info('Retention receiver ready')
}

const stop = async () => {
  await closeSenders()

  if (statementDataReceiver) {
    await statementDataReceiver.close()
    statementDataReceiver = null
  }
  if (retentionReceiver) {
    await retentionReceiver.close()
    retentionReceiver = null
  }

  if (sbClient) {
    try {
      await sbClient.close()
    } catch (error) {
      console.error('Error closing Service Bus client:', error)
    }
    sbClient = null
  }
}

module.exports = { start, stop }
