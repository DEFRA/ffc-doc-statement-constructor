const groupBy = require('./group-by')

const getActionsGroupsByActions = (actions) => {
  const groupObjects = groupBy(actions, 'groupName')
  return Object.keys(groupObjects).map(key => ({ groupName: key, actions: groupObjects[key] }))
}

module.exports = getActionsGroupsByActions
