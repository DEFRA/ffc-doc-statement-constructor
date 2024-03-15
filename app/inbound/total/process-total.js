const db = require('../../data')

const getTotalByCalculationReference = require('./get-total-by-calculation-reference')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const saveTotal = require('./save-total')
const saveActions = require('./save-actions')
const validateTotal = require('./validate-total')

const processTotal = async (total) => {
  const transaction = await db.sequelize.transaction()
  try {
    const existingTotal = await getTotalByCalculationReference(total.calculationReference, transaction)
    if (existingTotal) {
      console.info(`Duplicate calculationReference received, skipping ${existingTotal.calculationReference}`)
      await transaction.rollback()
    } else {
      validateTotal(total, total.calculationReference)
      await savePlaceholderOrganisation({ sbi: total.sbi }, total.sbi)
      const savedTotal = await saveTotal(total, transaction)
      await saveActions(savedTotal.actions, savedTotal.calculationId, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processTotal
