require('log-timestamp')
require('./insights').setup()

const alerting = require('ffc-alerting-utils')
const messageConfig = require('./config/message')
const { SOURCE } = require('./constants/source')
const { DATA_PROCESSING_ERROR } = require('./constants/alerts')

if (typeof alerting.init === 'function') {
  alerting.init({
    topic: messageConfig.alertTopic,
    source: SOURCE,
    defaultType: DATA_PROCESSING_ERROR
  })
} else {
  process.env.ALERT_TOPIC = process.env.ALERT_TOPIC || messageConfig.alertTopic
  process.env.ALERT_SOURCE = process.env.ALERT_SOURCE || SOURCE
  process.env.ALERT_TYPE = process.env.ALERT_TYPE || DATA_PROCESSING_ERROR
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
