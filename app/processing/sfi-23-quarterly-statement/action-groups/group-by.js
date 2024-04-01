const groupBy = (arr, property) => {
  return arr.reduce(function (groups, x) {
    if (!groups[x[property]]) { groups[x[property]] = [] }
    groups[x[property]].push(x)
    return groups
  }, {})
}

module.exports = groupBy
