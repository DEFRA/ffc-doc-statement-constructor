const db = require('../../data')

const getLastSettlementByInvoiceNumber = async (invoiceNumber, transaction) => {
  return db.settlement.findOne({
    transaction,
    attributes: [
      'value'
    ],
    where: {
      invoiceNumber,
      settled: true
    },
    order: [
      ['settlementDate', 'DESC']
    ],
    raw: true
  })
}

module.exports = getLastSettlementByInvoiceNumber
