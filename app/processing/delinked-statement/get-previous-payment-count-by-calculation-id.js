const { d365 } = require('../../database')

const getPreviousPaymentCountByCalculationId = async (calculationId) => {
  const { count } = await d365()
    .count({ count: '*' })
    .whereNotNull('completePublish')
    .where({ calculationId })
    .first()
  return Number(count)
}

module.exports = getPreviousPaymentCountByCalculationId
