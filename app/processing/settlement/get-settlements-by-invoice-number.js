const db = require('../../data')

const getSettlementsByInvoiceNumber = async (settlementDate, completedInvoiceNumbers, transaction) => {
  return db.settlement.findAll({
    transaction,
    attributes: [
      'settlementDate',
      'invoiceNumber',
      'value'
    ],
    where: {
      settlementDate,
      invoiceNumber: {
        [db.Sequelize.Op.in]: completedInvoiceNumbers
      },
      settled: true
    },
    raw: true
  })
}

module.exports = getSettlementsByInvoiceNumber
