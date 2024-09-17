const db = require('../../../data')

const getPreviousSettlement = async (settlementDate, value, invoiceNumber, reference, transaction) => {
  const valueParam = value > 0 ? db.Sequelize.Op.lt : db.Sequelize.Op.gt
  return db.settlement.findOne({
    transaction,
    attributes: [
      'value'
    ],
    where: {
      settlementDate: {
        [db.Sequelize.Op.lte]: settlementDate
      },
      value: {
        [valueParam]: value
      },
      invoiceNumber,
      reference: {
        [db.Sequelize.Op.ne]: reference
      },
      settled: true
    },
    order: [
      ['settlementDate', 'DESC'],
      ['value', 'DESC']
    ],
    raw: true
  })
}

module.exports = getPreviousSettlement
