const db = require('../../data')

const saveD365 = async (transformedD365, transaction) => {
  if (!transformedD365.paymentAmount || !transformedD365.transactionDate) {
    throw new Error(`D365 record missing required fields: paymentAmount or transactionDate for ${transformedD365.paymentReference}`)
  }

  return db.d365.create(transformedD365, {
    transaction,
    raw: true
  })
}

module.exports = saveD365
