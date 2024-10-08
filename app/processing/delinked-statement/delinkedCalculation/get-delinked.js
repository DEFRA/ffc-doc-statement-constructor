const getDelinkedByCalculationId = require('./get-delinked-by-calculation-id')
const validateDelinked = require('./validate-delinked')

const getDelinked = async (calculationId) => {
  const delinked = await getDelinkedByCalculationId(calculationId)
  return validateDelinked(delinked, calculationId)
}
console.log('get-delinked', getDelinked)
module.exports = getDelinked
