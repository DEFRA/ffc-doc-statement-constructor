const util = require('util')
const { processStatementData } = require('../inbound')

const processStatementDataMessage = async (message, receiver) => {
  try {
    const statementData = message.body
    console.log('Processing statement data:', util.inspect(statementData, false, null, true))
    await processStatementData(statementData)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process statement message:', err)
  }
}

module.exports = processStatementDataMessage
