const db = require('../../data')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const getDelinkedByCalculationId = require('./get-delinked-by-calculation-id')
const saveDelinked = require('./save-delinked')
const validateDelinked = require('./validate-delinked')

const processDelinked = async (delinked) => {
  const transformedDelinked = {
    ...delinked,
    calculationId: delinked.calculationReference,
    applicationId: delinked.applicationReference
  }
  delete transformedDelinked.calculationReference
  delete transformedDelinked.applicationReference

  await validateDelinked(transformedDelinked, transformedDelinked.calculationId)

  const existingDelinked = await getDelinkedByCalculationId(transformedDelinked.calculationId)
  if (existingDelinked) {
    console.info(`Duplicate delinked received, skipping ${existingDelinked.calculationId}`)
    return
  }

  try {
    await savePlaceholderOrganisation({ sbi: transformedDelinked.sbi }, transformedDelinked.sbi)
  } catch (error) {
    console.error(`Failed to save placeholder organisation for SBI ${transformedDelinked.sbi}:`, error)
    throw error
  }

  const transaction = await db.sequelize.transaction()
  try {
    await saveDelinked(transformedDelinked, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

module.exports = processDelinked
