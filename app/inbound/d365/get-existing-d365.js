const { d365 } = require('../../data')

const getExistingD365 = async (record, transaction) => {
  const { paymentReference, paymentPeriod, paymentAmount, transactionDate } = record
  const existing = await d365(transaction)
    .where({ paymentReference, paymentPeriod, paymentAmount, transactionDate })
    .forUpdate()
    .first()
  return existing ?? null
}

module.exports = getExistingD365
