const db = require('../../data')

const getExistingD365 = async (d365, transaction) => {
  const { paymentReference, paymentPeriod, paymentAmount, transactionDate } = d365
  return db.d365.findOne({
    transaction,
    lock: true,
    where: { paymentReference, paymentPeriod, paymentAmount, transactionDate }
  })
}

module.exports = getExistingD365
