const config = require('../config')
const processStatementDataMessage = require('./process-statement-data-message')
const { MessageReceiver } = require('ffc-messaging')
const throughputOptions = {
  preFetchMessages: 250,
  maxConcurrentMessages: 25,
  receiveBatchSize: 20,
  processingTimeoutInMs: 30000
}

let statementDataReceiver

const start = async () => {
  const dataAction = message => processStatementDataMessage(message, statementDataReceiver)
  statementDataReceiver = new MessageReceiver(config.statementDataSubscription, dataAction, throughputOptions)
  await statementDataReceiver.subscribe()

  console.info('Ready to receive payment updates')
}

const stop = async () => {
  await statementDataReceiver.closeConnection()
}

module.exports = { start, stop }
