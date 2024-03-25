const getActions = require('./get-actions')
const getActionsGroupsByActions = require('./get-actions-groups-by-actions')

const getActionGroups = async (calculationReference) => {
  const actions = await getActions(calculationReference)
  return getActionsGroupsByActions(actions)
}

module.exports = getActionGroups
