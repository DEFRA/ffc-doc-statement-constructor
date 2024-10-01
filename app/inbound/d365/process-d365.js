const db = require('../../data')
const saveD365 = require('./save-d365')
const validateD365 = require('./validate-d365')
const getD365ByPaymentReference = require('./get-d365-by-payment-reference')

const processD365 = async (d365) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingD365 = await getD365ByPaymentReference(d365.paymentReference, transaction)
    if (existingD365) {
      console.info(`Duplicate D365 paymentReference received, skipping ${existingD365.paymentReference}`)
      await transaction.rollback()
    } else {
      // De-aliasing calculationReference
      const transformedD365 = {
        ...d365,
        calculationId: d365.calculationReference
      }

      delete transformedD365.calculationReference
      validateD365(d365, d365.paymentReference)
      await saveD365(d365, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processD365
