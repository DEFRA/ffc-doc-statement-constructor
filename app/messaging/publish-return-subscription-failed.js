const util = require('util')
const { RETURN_SUBCRIPTION_FAILED } = require('../constants/message-types')
const sendMessage = require('../messaging/send-message')
const config = require('../config')

const publishReturnSubscriptionFailed = async (paymentRequest, error) => {
  const body = {
    data: {
      message: error.message,
      ...paymentRequest
    }
  }

  await sendMessage(body, RETURN_SUBCRIPTION_FAILED, config.returnSubscriptionFailed)
  console.log('Message sent:', util.inspect(body, false, null, true))
}

module.exports = publishReturnSubscriptionFailed
