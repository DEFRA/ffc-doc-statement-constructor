const { d365 } = require('../../data')

const saveD365 = async (transformedD365, transaction) => {
  if (!transformedD365.paymentAmount || !transformedD365.transactionDate) {
    throw new Error(`D365 record missing required fields: paymentAmount or transactionDate for ${transformedD365.paymentReference}`)
  }

  const { paymentReference, calculationId, paymentPeriod, marketingYear, paymentAmount, transactionDate } = transformedD365

  return d365(transaction).insert({
    paymentReference,
    calculationId,
    paymentPeriod,
    marketingYear,
    paymentAmount,
    transactionDate
  })
}

module.exports = saveD365
