const db = require('../../data')

const saveRptUnequalTotalPayment = async (unequalTotalPayment) => {
  return db.rptUnequalTotalPayment.create(unequalTotalPayment)
}

module.exports = saveRptUnequalTotalPayment
