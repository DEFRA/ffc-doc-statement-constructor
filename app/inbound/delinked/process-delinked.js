const db = require('../../data')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const getDelinkedByCalculationId = require('./get-delinked-by-calculation-id')
const saveDelinked = require('./save-delinked')
const validateDelinked = require('./validate-delinked')

const processDelinked = async (delinked) => {
  try {
    const existingDelinked = await getDelinkedByCalculationId(delinked.calculationReference)
    if (existingDelinked) {
      console.info(`Duplicate delinked received, skipping ${existingDelinked.calculationId}`)
      return
    }

    const transformedDelinked = {
      ...delinked,
      calculationId: delinked.calculationReference,
      applicationId: delinked.applicationReference
    }
    delete transformedDelinked.calculationReference
    delete transformedDelinked.applicationReference

    await validateDelinked(transformedDelinked, transformedDelinked.calculationId)

    const transaction = await db.sequelize.transaction()
    try {
      await Promise.all([
        savePlaceholderOrganisation({ sbi: delinked.sbi }, delinked.sbi, transaction),
        saveDelinked(transformedDelinked, transaction)
      ])

      await transaction.commit()
      console.log(`Successfully committed delinked: ${transformedDelinked.calculationId}`)
    } catch (error) {
      console.error(`Transaction error for delinked ${transformedDelinked.calculationId}:`, error)
      await transaction.rollback()
      throw error
    }
  } catch (error) {
    console.error(`Failed to process delinked ${delinked?.calculationReference || 'unknown'}:`, error)
    throw error
  }
}

module.exports = processDelinked
