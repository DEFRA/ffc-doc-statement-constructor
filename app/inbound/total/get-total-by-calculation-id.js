const db = require('../../data')
const getTotalByCalculationId = async (calculationId, transaction) => {
  const result = await db.total.count({
    transaction,
    where: { calculationId },
    limit: 1
  })
  return result > 0 ? { calculationId } : null
}

module.exports = getTotalByCalculationId
