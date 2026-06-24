const { MessageReceiver } = require('ffc-messaging')
const config = require('../config')
const processStatementDataMessage = require('./process-statement-data-message')
const { processRetentionMessage } = require('./process-retention-message')

let statementDataReceiver
let retentionReceiver

const start = async () => {
  const dataAction = message => processStatementDataMessage(message, statementDataReceiver)
  statementDataReceiver = new MessageReceiver(config.statementDataSubscription, dataAction)
  await statementDataReceiver.subscribe()
  console.info('Ready to receive statement data updates')
  const retentionAction = message => processRetentionMessage(message, retentionReceiver)
  retentionReceiver = new MessageReceiver(config.retentionSubscription, retentionAction)
  await retentionReceiver.subscribe()
  console.info('Retention receiver ready')
}

const stop = async () => {
  await statementDataReceiver.closeConnection()
  await retentionReceiver.closeConnection()
}

module.exports = { start, stop }
