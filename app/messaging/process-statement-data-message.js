const processStatementData = require('../inbound/statement-data/process-statement-data')
const throughputTracker = require('./throughput-tracker')

const processStatementDataMessage = async (message, receiver) => {
  try {
    const statementData = message.body
    if (statementData.type === 'd365' || statementData.type === 'dax') {
      console.log(`Processing statement data - (${statementData.type}): paymentReference: ${statementData.paymentReference}`)
    } else {
      console.log(`Processing statement data - (${statementData.type}): frn: ${statementData.frn}, sbi: ${statementData.sbi}`)
    }
    await processStatementData(statementData)
    await receiver.completeMessage(message)
    throughputTracker.record(statementData.type)
  } catch (err) {
    console.error('Unable to process statement message:', err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processStatementDataMessage
