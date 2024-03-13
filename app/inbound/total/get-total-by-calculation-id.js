const db = require('../../data')

const getTotalByCalculationId = async (calculationReference, transaction) => {
  return db.total.findOne({
    transaction,
    lock: true,
    where: {
      calculationReference
    }
  })
}

module.exports = getTotalByCalculationId
