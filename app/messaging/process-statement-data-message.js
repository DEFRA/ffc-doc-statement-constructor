const util = require('util')
const processStatementData = require('../inbound/statement-data/process-statement-data')

const processStatementDataMessage = async (message, receiver) => {
  try {
    const statementData = message.body
    console.log(`Processing statement data - (${statementData.type}):`, util.inspect(statementData, false, null, true))
    await processStatementData(statementData)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process statement message:', err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processStatementDataMessage
