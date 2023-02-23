const db = require('../../data')

const getPositiveInvoiceLineByFundingCodeAndPaymentRequestId = async (fundingCode, paymentRequestId, transaction) => {
  return db.invoiceLine.findOne({
    transaction,
    attributes: [
      'value'
    ],
    where: {
      paymentRequestId,
      fundingCode,
      value: { [db.Sequelize.Op.gte]: 0 }
    },
    raw: true
  })
}

module.exports = getPositiveInvoiceLineByFundingCodeAndPaymentRequestId
