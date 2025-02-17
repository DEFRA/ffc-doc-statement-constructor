const util = require('util')
const { processReturnSettlement } = require('../inbound')
const publishReturnSubscriptionFailed = require('./publish-return-subscription-failed')

const processReturnMessage = async (message, receiver) => {
  try {
    const settlement = message.body
    console.log('Processing return settlement:', util.inspect(settlement, false, null, true))
    await processReturnSettlement(settlement)
    await receiver.completeMessage(message)
  } catch (err) {
    await publishReturnSubscriptionFailed(message.body, err)
    console.error('Unable to process return settlement:', err)
  }
}

module.exports = processReturnMessage
