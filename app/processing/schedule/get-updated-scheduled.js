const updateScheduledSettlementByScheduleId = require('./update-scheduled-by-schedule-id')

const getUpdatedScheduled = async (validScheduled, started, transaction) => {
  const updatedScheduled = []
  for (const validSchedule of validScheduled) {
    try {
      await updateScheduledSettlementByScheduleId(validSchedule.scheduleId, started, transaction)
      updatedScheduled.push(validSchedule)
    } catch (err) {
      console.error(`Could not update saved for: ${validSchedule.scheduleId}, removing from schedule`)
    }
  }
  return updatedScheduled
}

module.exports = getUpdatedScheduled
