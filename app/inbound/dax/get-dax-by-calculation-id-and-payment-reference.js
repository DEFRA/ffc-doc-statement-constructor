const db = require('../../data')

const getDaxByCalculationIdAndPaymentReference = async (dax, transaction) => {
  const { calculationReference, paymentReference } = dax
  return db.dax.findOne({
    transaction,
    lock: true,
    where: {
      calculationId: calculationReference,
      paymentReference
    }
  })
}

module.exports = getDaxByCalculationIdAndPaymentReference
