const db = require('../../data')

const getD365ByPaymentReference = async (paymentReference, transaction) => {
  const result = await db.d365.count({
    transaction,
    where: { paymentReference },
    limit: 1
  })
  return result > 0 ? { paymentReference } : null
}

module.exports = getD365ByPaymentReference
