const db = require('../../../data')

const getSettlementByPaymentReference = async (reference, transaction) => {
  return db.settlement.findOne({
    transaction,
    attributes: [
      'paymentRequestId',
      'invoiceNumber',
      'reference',
      'settled',
      'settlementDate',
      'value'
    ],
    where: {
      reference,
      settled: true
    },
    raw: true
  })
}

module.exports = getSettlementByPaymentReference
