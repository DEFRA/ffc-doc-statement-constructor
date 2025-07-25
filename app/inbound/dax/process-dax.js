const db = require('../../data')
const saveDax = require('./save-dax')
const validateDax = require('./validate-dax')
const getDaxByCalculationIdAndPaymentReference = require('./get-dax-by-calculation-id-and-payment-reference')
const { retryOnFkError } = require('../../utility/retry-fk-error')

const processDax = async (dax) => {
  await retryOnFkError(async () => {
    const transaction = await db.sequelize.transaction()
    try {
      const existingDax = await getDaxByCalculationIdAndPaymentReference(dax, transaction)
      if (existingDax) {
        console.info(`Duplicate Dax record received, skipping payment reference ${existingDax.paymentReference} for calculation ${existingDax.calculationReference}`)
        await transaction.rollback()
      } else {
        validateDax(dax, dax.paymentReference)
        await saveDax(dax, transaction)
        await transaction.commit()
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }, 'Dax', dax.calculationReference)
}

module.exports = processDax
