const voidScheduledByScheduleId = require('./void-scheduled-by-schedule-id')
const hasLaterPaymentRequest = require('../payment-request/has-later-payment-request')

const getRemovedDefunctPaymentSchedules = async (schedules, started, transaction) => {
  const updatedScheduled = []
  for (const schedule of schedules) {
    try {
      const isDefunct = await hasLaterPaymentRequest(schedule.paymentRequestId, transaction)
      if (isDefunct) {
        console.log(`Skipping defunct schedule: ${schedule.scheduleId}`)
        await voidScheduledByScheduleId(schedule.scheduleId, started, transaction)
      } else {
        updatedScheduled.push(schedule)
      }
    } catch (err) {
      console.error(`Could not check defunct status for: ${schedule.scheduleId}, removing from schedule`)
    }
  }
  return updatedScheduled
}

module.exports = getRemovedDefunctPaymentSchedules
