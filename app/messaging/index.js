const config = require('../config')
const processStatementDataMessage = require('./process-statement-data-message')
const { MessageReceiver } = require('ffc-messaging')

let statementDataReceiver

const start = async () => {
  const dataAction = message => processStatementDataMessage(message, statementDataReceiver)
  statementDataReceiver = new MessageReceiver(config.statementDataSubscription, dataAction)
  await statementDataReceiver.subscribe()

  console.info('Ready to receive payment updates')
}

const stop = async () => {
  await statementDataReceiver.closeConnection()
}

module.exports = { start, stop }
