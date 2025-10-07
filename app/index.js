require('log-timestamp')
require('./insights').setup()
const messageConfig = require('./config/message')
const { SOURCE } = require('./constants/source')
const { DATA_PROCESSING_ERROR } = require('./constants/alerts')
const { EventPublisher } = require('ffc-pay-event-publisher')

try {
  const alerting = require('ffc-alerting-utils')

  if (alerting.init) {
    alerting.init({
      topic: messageConfig.alertTopic,
      source: SOURCE,
      defaultType: DATA_PROCESSING_ERROR,
      EventPublisherClass: EventPublisher
    })
  } else {
    process.env.ALERT_TOPIC = messageConfig.alertTopic
    process.env.ALERT_SOURCE = SOURCE
    process.env.ALERT_TYPE = DATA_PROCESSING_ERROR
  }
} catch (err) {
  console.warn('Failed to initialize alerting utils:', err.message)
}

const messaging = require('./messaging')
const processing = require('./processing')

process.on('SIGTERM', async () => {
  try {
    await messaging.stop()
  } catch (err) {
    console.error('Error during shutdown:', err)
  }
  process.exit(0)
})

process.on('SIGINT', async () => {
  try {
    await messaging.stop()
  } catch (err) {
    console.error('Error during shutdown:', err)
  }
  process.exit(0)
})

const start = async () => {
  try {
    await messaging.start()
    await processing.start()
  } catch (err) {
    console.error('Failed to start application:', err)
    process.exit(1)
  }
}

start()
