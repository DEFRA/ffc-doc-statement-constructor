const { calculations } = require('../../database')

const getCalculationByInvoiceNumber = async (invoiceNumber, transaction) => {
  const calculation = await calculations(transaction)
    .select('calculationId', 'calculationDate', 'invoiceNumber', 'paymentRequestId', 'sbi')
    .where({ invoiceNumber })
    .first()
  return calculation ?? null
}

module.exports = getCalculationByInvoiceNumber
