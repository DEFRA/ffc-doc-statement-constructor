const db = require('../../data')

const getTotalByCalculationId = require('./get-total-by-calculation-id')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const saveTotal = require('./save-total')
const saveActions = require('./save-actions')
const validateTotal = require('./validate-total')

const processTotal = async (total) => {
  const transaction = await db.sequelize.transaction()
  try {
    const existingTotal = await getTotalByCalculationId(total.calculationId, transaction)
    if (existingTotal) {
      console.info(`Duplicate calculationId received, skipping ${existingTotal.calculationId}`)
      await transaction.rollback()
    } else {
      validateTotal(total, total.calculationId)
      await savePlaceholderOrganisation({ sbi: total.sbi }, total.sbi)
      await saveTotal(total, transaction)
      await saveActions(total.actions, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processTotal
