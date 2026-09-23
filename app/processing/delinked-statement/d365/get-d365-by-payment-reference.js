const { d365 } = require('../../../database')

const getD365ByPaymentReference = async (paymentReference) => {
  const record = await d365()
    .select('paymentReference', 'calculationId', 'paymentPeriod', 'marketingYear', 'paymentAmount', 'transactionDate')
    .where({ paymentReference })
    .first()
  return record ?? null
}

module.exports = getD365ByPaymentReference
