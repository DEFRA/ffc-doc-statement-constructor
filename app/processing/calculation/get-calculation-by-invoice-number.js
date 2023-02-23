const db = require('../../data')

const getCalculationByInvoiceNumber = async (invoiceNumber, transaction) => {
  return db.calculation.findOne({
    transaction,
    attributes: [
      'calculationId',
      'calculationDate',
      'invoiceNumber',
      'paymentRequestId',
      'sbi'
    ],
    where: {
      invoiceNumber
    },
    raw: true
  })
}

module.exports = getCalculationByInvoiceNumber
