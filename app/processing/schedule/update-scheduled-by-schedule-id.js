const db = require('../../data')

const updateScheduledByScheduleId = async (scheduleId, started, transaction) => {
  await db.schedule.update({ started }, {
    transaction,
    where: {
      scheduleId
    }
  })
}

module.exports = updateScheduledByScheduleId
