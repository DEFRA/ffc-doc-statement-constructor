const { dax } = require('../../database')

const getPreviousPaymentCountByCalculationId = async (calculationId) => {
  const { count } = await dax()
    .count({ count: '*' })
    .whereNotNull('completePublish')
    .where({ calculationId })
    .first()
  return Number(count)
}

module.exports = getPreviousPaymentCountByCalculationId
