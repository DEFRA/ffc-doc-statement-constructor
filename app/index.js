require('log-timestamp')
require('./insights').setup()

const alerting = require('ffc-alerting-utils')
const messageConfig = require('./config/message')
const { SOURCE } = require('./constants/source')
const { DATA_PROCESSING_ERROR } = require('./constants/alerts')
const { EventPublisher } = require('ffc-pay-event-publisher')

if (alerting.init) {
  alerting.init({
    topic: messageConfig.alertTopic,
    source: SOURCE,
    defaultType: DATA_PROCESSING_ERROR,
    EventPublisherClass: EventPublisher
  })
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
