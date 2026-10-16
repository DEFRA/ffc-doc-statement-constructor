const { totals } = require('../../database')
const TABLES = require('../../constants/tables')
const { pickColumns } = require('../../constants/columns')

const saveTotal = async (total, transaction) => {
  try {
    const transformedTotal = pickColumns({
      ...total,
      calculationId: total.calculationReference,
      claimId: total.claimReference
    }, TABLES.totals)

    await totals(transaction).insert(transformedTotal)
  } catch (error) {
    throw new Error(`Error saving total with Calculation Id ${total.calculationReference}: ${error.message}`)
  }
}

module.exports = saveTotal
