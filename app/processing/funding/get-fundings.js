const mapFundings = require('./map-fundings')
const validateFundings = require('./validate-fundings')
const getFundingsByCalculationId = require('./get-fundings-by-calculation-id')

const getFundings = async (calculationId, transaction) => {
  const rawFundings = await getFundingsByCalculationId(calculationId, transaction)
  const fundings = await mapFundings(rawFundings)
  return validateFundings(fundings, calculationId)
}

module.exports = getFundings
