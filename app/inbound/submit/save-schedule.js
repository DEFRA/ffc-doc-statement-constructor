const { SCHEDULE } = require('../../constants/categories')
const db = require('../../data')

const saveSchedule = async (paymentRequestId, transaction) => {
  await db.schedule.create({ paymentRequestId, category: SCHEDULE }, { transaction })
}

module.exports = saveSchedule
