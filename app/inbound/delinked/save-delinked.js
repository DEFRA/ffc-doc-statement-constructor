const db = require('../../data')

const saveDelinked = async (delinkedCalculation, transaction) => {
  try {
    console.log('Transformed delinkedCalculation:', delinkedCalculation)
    await db.delinkedCalculation.create(delinkedCalculation, { transaction })
  } catch (error) {
    throw new Error(`Error saving total with Calculation Id ${delinkedCalculation.calculationId}: ${error.message}`)
  }
}

module.exports = saveDelinked
