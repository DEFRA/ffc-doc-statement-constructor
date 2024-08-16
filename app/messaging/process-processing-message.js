const util = require('util')
const { processProcessingPaymentRequest } = require('../inbound')

const processProcessingMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Processing processing payment request:', util.inspect(paymentRequest, false, null, true))
    await processProcessingPaymentRequest(paymentRequest)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process processing message:', err)
    // if (specific type of error) {
    //   receiver.deadLetterMessgae(message)
    // }
  }
}

module.exports = processProcessingMessage
