const { d365 } = require('../../database')
const TABLES = require('../../constants/tables')
const { pickColumns } = require('../../constants/columns')

const saveD365 = async (transformedD365, transaction) => {
  if (!transformedD365.paymentAmount || !transformedD365.transactionDate) {
    throw new Error(`D365 record missing required fields: paymentAmount or transactionDate for ${transformedD365.paymentReference}`)
  }

  return d365(transaction).insert(pickColumns(transformedD365, TABLES.d365))
}

module.exports = saveD365
