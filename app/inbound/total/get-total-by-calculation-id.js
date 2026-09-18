const { totals } = require('../../data')

const getTotalByCalculationId = async (calculationId, transaction) => {
  const total = await totals(transaction)
    .where({ calculationId })
    .forUpdate()
    .first()
  return total ?? null
}

module.exports = getTotalByCalculationId
