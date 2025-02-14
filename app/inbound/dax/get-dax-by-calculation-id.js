const db = require('../../data')

const getDaxByCalculationId = async (calculationId, transaction) => {
  return db.dax.findOne({
    transaction,
    lock: true,
    where: {
      calculationId
    }
  })
}

module.exports = getDaxByCalculationId
