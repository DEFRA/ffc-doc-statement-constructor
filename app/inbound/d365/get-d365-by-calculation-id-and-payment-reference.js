const db = require('../../data')

const getD365ByCalculationIdAndPaymentReference = async (d365, transaction) => {
  const { calculationReference, paymentReference } = d365
  return db.d365.findOne({
    transaction,
    lock: true,
    where: { paymentReference, calculationId: calculationReference }
  })
}

module.exports = getD365ByCalculationIdAndPaymentReference
