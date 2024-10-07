const db = require('../../data')

const getDelinkedByCalculationId = async (calculationId, transaction) => {
  return db.delinkedCalculation.findOne({
    transaction,
    lock: true,
    where: {
      calculationId
    }
  })
}

module.exports = getDelinkedByCalculationId
