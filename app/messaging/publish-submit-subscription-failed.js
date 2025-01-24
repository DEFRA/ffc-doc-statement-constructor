const util = require('util')
const { SUBMIT_SUBCRIPTION_FAILED } = require('../constants/message-types')
const sendMessage = require('../messaging/send-message')
const config = require('../config')

const publishSubmitSubscriptionFailed = async (paymentRequest, error) => {
  const body = {
    data: {
      message: error.message,
      ...paymentRequest
    }
  }

  await sendMessage(body, SUBMIT_SUBCRIPTION_FAILED, config.submitSubscriptionFailed)
  console.log('Message sent:', util.inspect(body, false, null, true))
}

module.exports = publishSubmitSubscriptionFailed
