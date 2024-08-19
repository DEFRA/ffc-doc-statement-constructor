const db = require('../../data')

const getExcludedPaymentReferenceByPaymentReference = async (paymentReference) => {
  const excludedPaymentReference = await db.excludedPaymentReference.findOne({
    attributes: [
      'frn',
      'paymentReference'
    ],
    where: {
      paymentReference
    },
    raw: true
  })
  if (excludedPaymentReference) {
    return true
  } else {
    return false
  }
}

module.exports = getExcludedPaymentReferenceByPaymentReference
