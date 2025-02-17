const util = require('util')
const { SUBMIT_SUBSCRIPTION_FAILED } = require('../constants/message-types')
const sendMessage = require('../messaging/send-message')
const config = require('../config')
const { v4: uuidv4 } = require('uuid')

const publishSubmitSubscriptionFailed = async (paymentRequest, error) => {
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
      type: SUBMIT_SUBSCRIPTION_FAILED,
      source: config.submitSubscriptionFailed.source
    }
  }

  await sendMessage(body, SUBMIT_SUBSCRIPTION_FAILED, config.submitSubscriptionFailed, options)
  console.log('Message sent:', util.inspect(body, false, null, true))
}

module.exports = publishSubmitSubscriptionFailed
