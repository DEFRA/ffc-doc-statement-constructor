const db = require('../../data')

const getSettlementByInvoiceNumberAndValue = async (invoiceNumber, value, transaction) => {
  return db.settlement.findOne({
    transaction,
    lock: true,
    where: {
      invoiceNumber,
      value
    }
  })
}

module.exports = getSettlementByInvoiceNumberAndValue
