const db = require('../../data')

const getNegativeInvoiceLineByFundingCodeAndPaymentRequestId = async (fundingCode, paymentRequestId, transaction) => {
  return db.invoiceLine.findAll({
    transaction,
    attributes: [
      'description',
      'value'
    ],
    where: {
      paymentRequestId,
      fundingCode,
      value: { [db.Sequelize.Op.lt]: 0 }
    },
    raw: true
  })
}

module.exports = getNegativeInvoiceLineByFundingCodeAndPaymentRequestId
