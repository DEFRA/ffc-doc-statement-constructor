const { getPaymentSchedule, sendPaymentSchedule, validatePaymentSchedule } = require('./payment-schedule')
const { schedulePendingPaymentSchedules } = require('./schedule')
const updateScheduleByScheduleId = require('./update-schedule-by-schedule-id')

const processPaymentSchedules = async () => {
  const pendingPaymentSchedules = await schedulePendingPaymentSchedules()

  for (const pendingPaymentSchedule of pendingPaymentSchedules) {
    try {
      const paymentData = {
        paymentRequestId: pendingPaymentSchedule.paymentRequestId,
        scheduleId: pendingPaymentSchedule.scheduleId
      }
      const aggregatedSchedule = await getPaymentSchedule(paymentData)
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
