const { delinkedCalculations } = require('../../database')
const TABLES = require('../../constants/tables')
const { pickColumns } = require('../../constants/columns')

const saveDelinked = async (transformedDelinked, transaction) => {
  const delinkedRecord = pickColumns({
    ...transformedDelinked,
    updated: transformedDelinked.updated || new Date()
  }, TABLES.delinkedCalculations)

  return delinkedCalculations(transaction).insert(delinkedRecord)
}

module.exports = saveDelinked
