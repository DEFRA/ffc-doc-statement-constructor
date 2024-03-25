const getTotalByCalculationId = require('./get-total-by-calculation-id')
const validateTotal = require('./validate-total')

const getTotal = async (calculationId) => {
  const total = await getTotalByCalculationId(calculationId)
  return validateTotal(total, calculationId)
}

module.exports = getTotal
