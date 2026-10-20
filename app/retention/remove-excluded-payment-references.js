const { excludedPaymentReferences } = require('../database')

const removeExcludedPaymentReferences = async (paymentReferences, transaction) => {
  await excludedPaymentReferences(transaction)
    .whereIn('paymentReference', paymentReferences)
    .del()
}

module.exports = {
  removeExcludedPaymentReferences
}
