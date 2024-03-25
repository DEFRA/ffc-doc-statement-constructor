const getActionsGroupsByActions = (actions) => {
  const groupObjects = groupBy(actions, 'groupName')
  return Object.keys(groupObjects).map(key => ({ groupName: key, actions: JSON.stringify(groupObjects[key]) }))
}

const groupBy = (arr, property) => {
  return arr.reduce(function (groups, x) {
    if (!groups[x[property]]) { groups[x[property]] = [] }
    groups[x[property]].push(x)
    return groups
  }, {})
}

module.exports = getActionsGroupsByActions
