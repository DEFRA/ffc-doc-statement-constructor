const db = require('../../data')

const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const getTotalByCalculationReference = require('./get-total-by-calculation-reference')
const saveTotal = require('./save-total')
const saveActions = require('./save-actions')

const processTotal = async (total) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingTotal = await getTotalByCalculationReference(total.calculationId, transaction)
    if (existingTotal) {
      console.info(`Duplicate calculation received, skipping ${existingTotal.calculationId}`)
      await transaction.rollback()
    } else {
      await savePlaceholderOrganisation({ sbi: total.sbi }, total.sbi)
      const savedTotal = await saveTotal(total, transaction)
      await saveActions(total.actions, savedTotal.calculationId, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processTotal
