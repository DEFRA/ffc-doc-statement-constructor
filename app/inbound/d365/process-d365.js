const db = require('../../data')
const saveD365 = require('./save-d365')
const validateD365 = require('./validate-d365')
const getD365ByPaymentReference = require('./get-d365-by-payment-reference')

const processD365 = async (d365) => {
  const transformedD365 = {
    ...d365,
    calculationId: d365.calculationReference
  }
  delete transformedD365.calculationReference

  validateD365(transformedD365, transformedD365.paymentReference)

  const existingD365 = await getD365ByPaymentReference(transformedD365.paymentReference)
  if (existingD365) {
    console.info(`Duplicate D365 paymentReference received, skipping ${existingD365.paymentReference}`)
    return
  }

  const transaction = await db.sequelize.transaction()
  try {
    await saveD365(transformedD365, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

module.exports = processD365
