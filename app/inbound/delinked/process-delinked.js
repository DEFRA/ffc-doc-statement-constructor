const db = require('../../data')

const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const getDelinkedByCalculationReference = require('./get-delinked-by-calculation-reference')
const saveDelinked = require('./save-delinked')

const processDelinked = async (delinked) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingDelinked = await getDelinkedByCalculationReference(delinked.calculationReference, transaction)
    if (existingDelinked) {
      console.info(`Duplicate delinked received, skipping ${existingDelinked.calculationReference}`)
      await transaction.rollback()
    } else {
      await savePlaceholderOrganisation({ sbi: delinked.sbi }, delinked.sbi)
      await saveDelinked(delinked, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processDelinked
