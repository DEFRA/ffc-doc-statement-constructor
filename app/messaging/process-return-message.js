const util = require('util')

const { processReturnSettlement } = require('../inbound')
const processReturnMessage = async (message, receiver) => {
  try {
    const settlement = message.body
    console.log('Processing return settlement:', util.inspect(settlement, false, null, true))
    await processReturnSettlement(settlement)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process return settlement:', err)
  }
}

module.exports = processReturnMessage
