const { dax } = require('../../database')

const getDaxByCalculationIdAndPaymentReference = async (record, transaction) => {
  const { calculationReference, paymentReference } = record
  const existing = await dax(transaction)
    .where({ calculationId: calculationReference, paymentReference })
    .forUpdate()
    .first()
  return existing ?? null
}

module.exports = getDaxByCalculationIdAndPaymentReference
