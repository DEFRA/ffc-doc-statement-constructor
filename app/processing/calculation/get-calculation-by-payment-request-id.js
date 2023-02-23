const db = require('../../data')

const getCalculationByPaymentRequestId = async (paymentRequestId, transaction) => {
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
      paymentRequestId
    },
    raw: true
  })
}

module.exports = getCalculationByPaymentRequestId
