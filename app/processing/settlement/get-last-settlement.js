const db = require('../../data')

const getLastSettlement = async (settlementDate, value, invoiceNumber, transaction) => {
  const valueParam = value > 0 ? db.Sequelize.Op.lt : db.Sequelize.Op.gt
  return db.settlement.findOne({
    transaction,
    attributes: [
      'value'
    ],
    where: {
      settlementDate: {
        [db.Sequelize.Op.lt]: settlementDate
      },
      value: {
        [valueParam]: value
      },
      invoiceNumber,
      settled: true
    },
    order: [
      ['settlementDate', 'DESC']
    ],
    raw: true
  })
}

module.exports = getLastSettlement
