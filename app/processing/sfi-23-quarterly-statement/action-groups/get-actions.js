const getActionsByCalculationReference = require('./get-actions-by-calculation-reference')
const validateActions = require('./validate-actions')

const getActions = async (calculationId) => {
  const actions = await getActionsByCalculationReference(calculationId)
  return validateActions(actions, calculationId)
}

module.exports = getActions
