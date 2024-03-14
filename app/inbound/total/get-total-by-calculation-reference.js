const db = require('../../data')

const getTotalByCalculationReference = async (calculationReference, transaction) => {
  return db.total.findOne({
    transaction,
    lock: true,
    where: {
      calculationId: calculationReference
    }
  })
}

module.exports = getTotalByCalculationReference
