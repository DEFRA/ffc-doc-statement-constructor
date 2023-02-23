const db = require('../../data')

const getCompletedSchedule = async (paymentRequestId, transaction) => {
  return await db.schedule.findOne({
    transaction,
    where: {
      paymentRequestId,
      completed: {
        [db.Sequelize.Op.ne]: null
      },
      voided: null
    }
  })
}

module.exports = getCompletedSchedule
