const db = require('../../data')

const getCalculationByCalculationReference = async (calculationReference, transaction) => {
  return db.calculation.findOne({
    transaction,
    lock: true,
    where: {
      calculationReference
    }
  })
}

module.exports = getCalculationByCalculationReference
