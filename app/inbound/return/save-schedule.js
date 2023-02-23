const { STATEMENT } = require('../../constants/categories')
const db = require('../../data')
const isFirstPayment = require('./is-first-payment')

const saveSchedule = async (settlement, transaction) => {
  if (settlement) {
    if (isFirstPayment(settlement.invoiceNumber)) {
      await db.schedule.create({ settlementId: settlement.settlementId, category: STATEMENT }, { transaction })
    }
  } else {
    throw new Error('Schedule can not be saved for null settlement')
  }
}

module.exports = saveSchedule
