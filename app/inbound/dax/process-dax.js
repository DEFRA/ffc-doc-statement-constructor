const db = require('../../data')
const saveDax = require('./save-dax')
const validateDax = require('./validate-dax')
const getDaxByPaymentReference = require('./get-dax-by-payment-reference')

const processDax = async (dax) => {
  validateDax(dax, dax.paymentReference)

  const existingDax = await getDaxByPaymentReference(dax.paymentReference)
  if (existingDax) {
    console.info(`Duplicate Dax paymentReference received, skipping ${existingDax.paymentReference}`)
    return
  }

  const transaction = await db.sequelize.transaction()
  try {
    await saveDax(dax, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

module.exports = processDax
