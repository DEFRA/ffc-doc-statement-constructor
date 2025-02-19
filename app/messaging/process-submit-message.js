const util = require('util')
const { processSubmitPaymentRequest } = require('../inbound')
const publishSubmitSubscriptionFailed = require('./publish-submit-subscription-failed')

const processSubmitMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Processing submit payment request:', util.inspect(paymentRequest, false, null, true))
    await processSubmitPaymentRequest(paymentRequest)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process submit message:', err)
    await publishSubmitSubscriptionFailed(message.body, err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processSubmitMessage
