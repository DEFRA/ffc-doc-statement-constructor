const util = require('util')
const { RETURN_SUBSCRIPTION_FAILED } = require('../constants/message-types')
const sendMessage = require('../messaging/send-message')
const config = require('../config')
const { v4: uuidv4 } = require('uuid')

const publishReturnSubscriptionFailed = async (paymentRequest, error) => {
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
      type: RETURN_SUBSCRIPTION_FAILED,
      source: config.returnSubscriptionFailed.source
    }
  }

  await sendMessage(body, RETURN_SUBSCRIPTION_FAILED, config.returnSubscriptionFailed, options)
  console.log('Message sent:', util.inspect(body, false, null, true))
}

module.exports = publishReturnSubscriptionFailed
