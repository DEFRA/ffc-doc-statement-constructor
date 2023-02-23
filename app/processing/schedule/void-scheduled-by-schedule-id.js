const db = require('../../data')

const voidScheduledByScheduleId = async (scheduleId, voided, transaction) => {
  await db.schedule.update({ voided }, {
    transaction,
    where: {
      scheduleId
    }
  })
}

module.exports = voidScheduledByScheduleId
