const db = require('../../data')

const getDelinkedByCalculationReference = async (calculationId, transaction) => {
  return db.delinkedCalculation.findOne({
    transaction,
    lock: true,
    where: {
      calculationId
    }
  })
}

module.exports = getDelinkedByCalculationReference
