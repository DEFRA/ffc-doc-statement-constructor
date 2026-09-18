const { delinkedCalculations } = require('../../data')

const getDelinkedByCalculationId = async (calculationId, transaction) => {
  const existing = await delinkedCalculations(transaction)
    .select('calculationId')
    .where({ calculationId })
    .first()
  return existing ? { calculationId } : null
}

module.exports = getDelinkedByCalculationId
