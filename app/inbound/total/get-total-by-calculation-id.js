const db = require('../../data')

const getTotalByCalculationId = async (calculationId, transaction) => {
  return db.total.findOne({
    transaction,
    lock: true,
    where: {
      calculationId
    }
  })
}

module.exports = getTotalByCalculationId
