const db = require('../../data')
const getTotalByCalculationId = require('./get-total-by-calculation-id')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const saveTotal = require('./save-total')
const saveActions = require('./save-actions')
const validateTotal = require('./validate-total')
const { retryOnFkError } = require('../../utility/retry-fk-error')

const processTotal = async (total) => {
  await retryOnFkError(async () => {
    const transaction = await db.sequelize.transaction()
    try {
      const existingTotal = await getTotalByCalculationId(total.calculationReference, transaction)
      if (existingTotal) {
        console.info(`Duplicate calculationId received, skipping ${existingTotal.calculationId}`)
        await transaction.rollback()
      } else {
        validateTotal(total, total.calculationReference)
        await savePlaceholderOrganisation({ sbi: total.sbi }, total.sbi)
        await saveTotal(total, transaction)
        await saveActions(total.actions, transaction)
        await transaction.commit()
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }, 'total', total.calculationReference)
}

module.exports = processTotal
