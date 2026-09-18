const { delinkedCalculations } = require('../data')

const removeDelinkedCalculations = async (calculationIds, transaction) => {
  await delinkedCalculations(transaction)
    .whereIn('calculationId', calculationIds)
    .del()
}

module.exports = {
  removeDelinkedCalculations
}
