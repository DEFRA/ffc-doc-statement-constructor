const db = require('../../data')

const saveDelinked = async (calculationId, transaction) => {
  return db.delinkedCalculation.create(calculationId, { transaction })
}

module.exports = saveDelinked
