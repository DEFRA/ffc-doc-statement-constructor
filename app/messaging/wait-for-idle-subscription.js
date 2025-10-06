const { MessageReceiver } = require('ffc-messaging')
const { dataProcessingAlert } = require('ffc-alerting-utils')
const Long = require('long')
const config = require('../config/message')
const sleep = require('./sleep')
const { DATA_PROCESSING_ERROR } = require('../../app/constants/alerts')

const waitForIdleSubscription = async (subscription, processName) => {
  let receiver
  try {
    receiver = new MessageReceiver(subscription)
    let idle = false
    do {
      const messages = await receiver.peekMessages(config.idleCheckBatchSize, { fromSequenceNumber: Long.fromInt(0) })
      const idleCount = messages.filter(message => message.deliveryCount > config.idleCheckMaxDeliveryCount).length
      idle = idleCount === messages.length
      if (!idle) {
        console.info(`${processName} processing paused - waiting for ${messages.length - idleCount} messages to be idle on topic ${subscription.topic}`)
        await sleep(config.idleCheckInterval)
      }
    } while (!idle)
  } catch (err) {
    console.error(err)
    try {
      await dataProcessingAlert({
        process: 'waitForIdleSubscription',
        processName,
        error: err,
        message: `Error waiting for idle subscription on topic ${subscription.topic}`
      }, DATA_PROCESSING_ERROR)
    } catch (error) {
      console.error(`Error detected at: ${processName}`, error)
    }
    throw err
  } finally {
    if (receiver && typeof receiver.closeConnection === 'function') {
      try {
        await receiver.closeConnection()
      } catch (error) {
        console.error(error)
      }
    }
  }
}

module.exports = waitForIdleSubscription
