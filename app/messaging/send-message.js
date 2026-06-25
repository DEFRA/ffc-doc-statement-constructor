const { MessageSender } = require('ffc-messaging')
const createMessage = require('./create-message')

let sharedSender = null

const getOrCreateSender = (config) => {
  if (!sharedSender) {
    sharedSender = new MessageSender(config)
  }
  return sharedSender
}

const sendMessage = async (body, type, config, options) => {
  const message = createMessage(body, type, config.source, options)

  try {
    await getOrCreateSender(config).sendMessage(message)
  } catch (err) {
    console.warn('MessageSender failed, closing and retrying:', err.message)
    if (sharedSender) {
      try {
        await sharedSender.closeConnection()
      } finally {
        sharedSender = null
      }
    }

    await getOrCreateSender(config).sendMessage(message)
  }
}

const closeConnection = async () => {
  if (sharedSender) {
    await sharedSender.closeConnection()
    sharedSender = null
  }
}

module.exports = sendMessage
module.exports.closeConnection = closeConnection
