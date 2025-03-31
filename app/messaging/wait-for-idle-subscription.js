const { MessageReceiver } = require('ffc-messaging')
const Long = require('long')
const config = require('../config/message')

const waitForIdleSubscription = async (subscription, processName) => {
  let receiver
  try {
    receiver = new MessageReceiver(subscription)

    const messages = await receiver.peekMessages(config.idleCheckBatchSize, { fromSequenceNumber: Long.fromInt(0) })

    if (messages.length === 0) {
      console.info(`${processName}: No messages found in subscription`)
      return true
    }

    if (messages.length > 1000) {
      console.info(`${processName}: Large backlog of ${messages.length} messages detected, proceeding with processing`)
      return true
    }

    const idleCount = messages.filter(message => message.deliveryCount > config.idleCheckMaxDeliveryCount).length
    const idlePercentage = (idleCount / messages.length) * 100

    if (idleCount > 0 || idlePercentage >= 5) {
      console.info(`${processName}: ${idleCount} idle messages found (${idlePercentage.toFixed(1)}%), proceeding with processing`)
      return true
    }

    console.info(`${processName} processing paused - waiting for ${messages.length - idleCount} messages to be idle on topic ${subscription.topic}`)
    return false
  } catch (err) {
    console.error(`Error checking idle messages for ${processName}:`, err)
    return true
  } finally {
    if (receiver) {
      await receiver.closeConnection()
    }
  }
}

module.exports = waitForIdleSubscription
