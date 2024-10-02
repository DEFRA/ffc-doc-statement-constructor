const db = require('../../data')

const saveDelinked = async (transformedDelinked, transaction) => {
  try {
    await db.delinkedCalculation.create(transformedDelinked, { transaction })
  } catch (error) {
    throw new Error(`Error saving total with Calculation Id ${transformedDelinked.calculationId}: ${error.message}`)
  }
}

module.exports = saveDelinked
