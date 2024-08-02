const db = require('../../data')

const getExcludedPaymentReferenceByPaymentReference = async (paymentReference) => {
  return db.excludedPaymentReference.findOne({
    attributes: [
      'frn',
      'paymentReference'
    ],
    where: {
      paymentReference
    },
    raw: true
  })
}

module.exports = getExcludedPaymentReferenceByPaymentReference
