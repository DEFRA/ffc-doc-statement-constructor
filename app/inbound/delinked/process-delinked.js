const db = require('../../data')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const getDelinkedByCalculationId = require('./get-delinked-by-calculation-id')
const saveDelinked = require('./save-delinked')
const validateDelinked = require('./validate-delinked')

const processDelinked = async (delinked) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingDelinked = await getDelinkedByCalculationId(delinked.calculationReference, transaction)
    if (existingDelinked) {
      console.info(`Duplicate delinked received, skipping ${existingDelinked.calculationId}`)
      await transaction.rollback()
    } else {
      await savePlaceholderOrganisation({ sbi: delinked.sbi }, delinked.sbi)

      // De-aliasing calculationReference and applicationReference
      const transformedDelinked = {
        ...delinked,
        calculationId: delinked.calculationReference,
        applicationId: delinked.applicationReference
      }

      delete transformedDelinked.calculationReference
      delete transformedDelinked.applicationReference
      await validateDelinked(transformedDelinked, transformedDelinked.calculationId)
      await saveDelinked(transformedDelinked, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processDelinked
