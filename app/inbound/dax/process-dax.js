const db = require('../../data')
const saveDax = require('./save-dax')
const validateDax = require('./validate-dax')
const getDaxByCalculationId = require('./get-dax-by-calculation-id')

const processDax = async (dax) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingDax = await getDaxByCalculationId(dax.calculationReference, transaction)
    if (existingDax) {
      console.info(`Duplicate Dax calculation ID received, skipping calculation ID ${existingDax.calculationId} for ${existingDax.paymentReference}`)
      await transaction.rollback()
    } else {
      validateDax(dax, dax.paymentReference)
      await saveDax(dax, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processDax
