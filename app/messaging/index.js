const config = require('../config')
const processStatementDataMessage = require('./process-statement-data-message')
const { MessageReceiver } = require('ffc-messaging')
let processingReceiver
let submitReceiver
let returnReceiver
let statementDataReceiver

const start = async () => {
  const dataAction = message => processStatementDataMessage(message, statementDataReceiver)
  statementDataReceiver = new MessageReceiver(config.statementDataSubscription, dataAction)
  await statementDataReceiver.subscribe()

  console.info('Ready to receive payment updates')
}

const stop = async () => {
  await processingReceiver.closeConnection()
  await submitReceiver.closeConnection()
  await returnReceiver.closeConnection()
  await statementDataReceiver.closeConnection()
}

module.exports = { start, stop }
