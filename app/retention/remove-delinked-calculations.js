const { delinkedCalculations } = require('../database')

const removeDelinkedCalculations = async (calculationIds, transaction) => {
  await delinkedCalculations(transaction)
    .whereIn('calculationId', calculationIds)
    .del()
}

module.exports = {
  removeDelinkedCalculations
}
