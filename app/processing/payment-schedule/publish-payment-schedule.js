const util = require('util')

const config = require('../../config')
const sendMessage = require('../../messaging/send-message')

const publishPaymentSchedule = async (schedule) => {
  await sendMessage(schedule, 'uk.gov.pay.payment.schedule', config.statementTopic)
  console.log('Payment schedule sent:', util.inspect(schedule, false, null, true))
}

module.exports = publishPaymentSchedule
