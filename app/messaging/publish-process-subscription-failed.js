const util = require('util')
const { PROCESSING_SUBCRIPTION_FAILED } = require('../constants/message-types')
const sendMessage = require('../messaging/send-message')
const config = require('../config')

const publishProcessingSubscriptionFailed = async (paymentRequest, error) => {
  const body = {
    data: {
      message: error.message,
      ...paymentRequest
    }
  }

  await sendMessage(body, PROCESSING_SUBCRIPTION_FAILED, config.processingSubscriptionFailed)
  console.log('Message sent:', util.inspect(body, false, null, true))
}

module.exports = publishProcessingSubscriptionFailed
