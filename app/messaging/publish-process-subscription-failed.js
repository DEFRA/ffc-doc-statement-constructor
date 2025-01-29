const util = require('util')
const { PROCESSING_SUBCRIPTION_FAILED } = require('../constants/message-types')
const sendMessage = require('../messaging/send-message')
const config = require('../config')
const { v4: uuidv4 } = require('uuid')

const publishProcessingSubscriptionFailed = async (paymentRequest, error) => {
  const options = {
    time: new Date(),
    id: uuidv4()
  }

  const body = {
    data: {
      message: error.message,
      ...paymentRequest
    },
    ...options,
    ...{
      type: PROCESSING_SUBCRIPTION_FAILED,
      source: config.processingSubscriptionFailed.source
    }
  }

  await sendMessage(body, PROCESSING_SUBCRIPTION_FAILED, config.processingSubscriptionFailed, options)
  console.log('Message sent:', util.inspect(body, false, null, true))
}

module.exports = publishProcessingSubscriptionFailed
