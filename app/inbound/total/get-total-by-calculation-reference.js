const db = require('../../data')

const getTotalByCalculationReference = async (calculationId, transaction) => {
  return db.total.findOne({
    transaction,
    lock: true,
    where: {
      calculationId
    }
  })
}

module.exports = getTotalByCalculationReference
