require('log-timestamp')
require('./insights').setup()

try {
  const alerting = require('ffc-alerting-utils')

  if (alerting.init) {
    const messageConfig = require('./config/message')
    const { SOURCE } = require('./constants/source')
    const { DATA_PROCESSING_ERROR } = require('./constants/alerts')
    const { EventPublisher } = require('ffc-pay-event-publisher')

    alerting.init({
      topic: messageConfig.alertTopic,
      source: SOURCE,
      defaultType: DATA_PROCESSING_ERROR,
      EventPublisherClass: EventPublisher
    })
  } else {
    const messageConfig = require('./config/message')
    const { SOURCE } = require('./constants/source')
    const { DATA_PROCESSING_ERROR } = require('./constants/alerts')

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
  await messaging.stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await messaging.stop()
  process.exit(0)
})

module.exports = (async () => {
  await messaging.start()
  await processing.start()
})()
