const publishPaymentSchedule = require('./publish-payment-schedule')

const sendPaymentSchedule = async (paymentSchedule) => {
  try {
    await publishPaymentSchedule(paymentSchedule)
  } catch (err) {
    throw new Error(`Failed to send payment schedule for ${paymentSchedule.frn}`, err)
  }
}

module.exports = sendPaymentSchedule
