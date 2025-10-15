const { dataProcessingAlert } = require('ffc-alerting-utils')
const db = require('../../data')
const getTotalByCalculationId = require('./get-total-by-calculation-id')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const saveTotal = require('./save-total')
const saveActions = require('./save-actions')
const validateTotal = require('./validate-total')
const { retryOnFkError } = require('../../utility/retry-fk-error')
const { DUPLICATE_RECORD } = require('../../constants/alerts')

const processTotal = async (total) => {
  await retryOnFkError(async () => {
    const transaction = await db.sequelize.transaction()
    try {
      const existingTotal = await getTotalByCalculationId(total.calculationReference, transaction)
      if (existingTotal) {
        console.info(`Duplicate calculationId received, skipping ${existingTotal.calculationId}`)
        await dataProcessingAlert({
          process: 'processTotal',
          ...total,
          message: `A duplicate record was received for calculation ID ${existingTotal.calculationId}`,
          type: DUPLICATE_RECORD
        }, DUPLICATE_RECORD)
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
