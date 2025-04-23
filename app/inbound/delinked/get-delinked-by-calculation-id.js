const db = require('../../data')

const getDelinkedByCalculationId = async (calculationId, transaction) => {
  const result = await db.delinkedCalculation.count({
    transaction,
    where: { calculationId },
    limit: 1
  })
  return result > 0 ? { calculationId } : null
}

module.exports = getDelinkedByCalculationId
