const db = require('../../data')

const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const getCalculationByCalculationReference = require('./get-calculation-by-calculation-reference')
const saveCalculation = require('./save-calculation')
const saveFundings = require('./save-fundings')

const processCalculation = async (calculation) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingCalculation = await getCalculationByCalculationReference(calculation.calculationReference, transaction)
    if (existingCalculation) {
      console.info(`Duplicate calculation received, skipping ${existingCalculation.calculationReference}`)
      await transaction.rollback()
    } else {
      await savePlaceholderOrganisation({ sbi: calculation.sbi }, calculation.sbi)
      const savedCalculation = await saveCalculation(calculation, transaction)
      await saveFundings(calculation.fundings, savedCalculation.calculationId, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processCalculation
