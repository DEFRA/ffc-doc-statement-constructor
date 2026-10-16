const { dax } = require('../../database')
const TABLES = require('../../constants/tables')
const { pickColumns } = require('../../constants/columns')

const saveDax = async (record, transaction) => {
  const transformedDax = pickColumns({
    ...record,
    calculationId: record.calculationReference
  }, TABLES.dax)

  return dax(transaction).insert(transformedDax)
}

module.exports = saveDax
