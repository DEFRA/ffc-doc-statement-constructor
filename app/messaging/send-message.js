const { getSender, sendMessage: sendServiceBusMessage } = require('./service-bus')
const createMessage = require('./create-message')

let sharedSender = null

const getOrCreateSender = (config) => {
  if (!sharedSender) {
    sharedSender = getSender(config)
  }
  return sharedSender
}

const sendMessage = async (body, type, config, options) => {
  const message = createMessage(body, type, config.source, options)

  try {
    await sendServiceBusMessage(getOrCreateSender(config), message, options)
  } catch (err) {
    console.warn('MessageSender failed, closing and retrying:', err.message)
    if (sharedSender) {
      try {
        await sharedSender.close()
      } finally {
        sharedSender = null
      }
    }

    await sendServiceBusMessage(getOrCreateSender(config), message, options)
  }
}

const closeConnection = async () => {
  if (sharedSender) {
    await sharedSender.close()
    sharedSender = null
  }
}

module.exports = sendMessage
module.exports.closeConnection = closeConnection
