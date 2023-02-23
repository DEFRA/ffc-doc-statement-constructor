const db = require('../data')

const updateScheduleByScheduleId = async (scheduleId) => {
  await db.schedule.update({ completed: new Date() }, {
    lock: true,
    where: {
      scheduleId
    }
  })
}

module.exports = updateScheduleByScheduleId
