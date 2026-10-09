const { excludedPaymentReferences } = require('../database')

const getExcludedPaymentReferenceByPaymentReference = async (paymentReference) => {
  const excludedPaymentReference = await excludedPaymentReferences()
    .select('frn', 'paymentReference')
    .where({ paymentReference })
    .first()
  return !!excludedPaymentReference
}

module.exports = getExcludedPaymentReferenceByPaymentReference
