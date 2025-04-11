const db = require('../../data')
const getTotalByCalculationId = require('./get-total-by-calculation-id')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const saveTotal = require('./save-total')
const saveActions = require('./save-actions')
const validateTotal = require('./validate-total')

const processTotal = async (total) => {
  validateTotal(total, total.calculationReference)

  const existingTotal = await getTotalByCalculationId(total.calculationReference)
  if (existingTotal) {
    console.info(`Duplicate calculationId received, skipping ${existingTotal.calculationId}`)
    return
  }

  const transaction = await db.sequelize.transaction()
  try {
    await savePlaceholderOrganisation({ sbi: total.sbi }, total.sbi, transaction)
    await saveTotal(total, transaction)
    await saveActions(total.actions, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processTotal
