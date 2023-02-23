const { MessageReceiver } = require('ffc-messaging')
const Long = require('long')
const config = require('../config/message')
const sleep = require('./sleep')

const waitForIdleSubscription = async (subscription) => {
  let receiver
  try {
    receiver = new MessageReceiver(subscription)
    let idle = false
    do {
      const messages = await receiver.peekMessages(config.idleCheckBatchSize, { fromSequenceNumber: Long.fromInt(0) })
      const idleCount = messages.filter(message => message.deliveryCount > config.idleCheckMaxDeliveryCount).length
      idle = idleCount === messages.length
      if (!idle) {
        console.info(`Waiting for ${messages.length - idleCount} messages to be idle on topic ${subscription.topic}`)
        await sleep(config.idleCheckInterval)
      }
    } while (!idle)
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await receiver.closeConnection()
  }
}

module.exports = waitForIdleSubscription
