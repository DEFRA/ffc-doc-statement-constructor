const { getPaymentSchedule, sendPaymentSchedule, validatePaymentSchedule } = require('./payment-schedule')
const { schedulePendingPaymentSchedules } = require('./schedule')
const updateScheduleByScheduleId = require('./update-schedule-by-schedule-id')

const processPaymentSchedules = async () => {
  const pendingPaymentSchedules = await schedulePendingPaymentSchedules()

  for (const pendingPaymentSchedule of pendingPaymentSchedules) {
    try {
      const aggregatedSchedule = await getPaymentSchedule(pendingPaymentSchedule.paymentRequestId)
      if (validatePaymentSchedule(aggregatedSchedule)) {
        await sendPaymentSchedule(aggregatedSchedule)
      }
      await updateScheduleByScheduleId(pendingPaymentSchedule.scheduleId)
    } catch (err) {
      console.error(err.message)
    }
  }
}

module.exports = processPaymentSchedules
