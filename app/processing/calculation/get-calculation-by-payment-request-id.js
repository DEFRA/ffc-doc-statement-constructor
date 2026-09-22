const { calculations } = require('../../database')

const getCalculationByPaymentRequestId = async (paymentRequestId, transaction) => {
  const calculation = await calculations(transaction)
    .select('calculationId', 'calculationDate', 'invoiceNumber', 'paymentRequestId', 'sbi')
    .where({ paymentRequestId })
    .first()
  return calculation ?? null
}

module.exports = getCalculationByPaymentRequestId
