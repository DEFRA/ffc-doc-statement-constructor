const db = require('../../data')

const getDelinkedByCalculationReference = async (calculationReference, transaction) => {
  return db.delinked.findOne({
    transaction,
    lock: true,
    where: {
      calculationReference
    }
  })
}

module.exports = getDelinkedByCalculationReference
