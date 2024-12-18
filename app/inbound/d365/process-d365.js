const db = require('../../data')
const { messageQueue, MessageTypes } = require('../../message-queue/delinked-message-queue')
const getD365ByPaymentReference = require('./get-d365-by-payment-reference')
const validateD365 = require('./validate-d365')

const processD365 = async (d365) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingD365 = await getD365ByPaymentReference(d365.paymentReference, transaction)
    if (existingD365) {
      console.info(`Duplicate D365 paymentReference received, skipping ${existingD365.paymentReference}`)
      await transaction.rollback()
      return
    }

    const transformedD365 = {
      ...d365,
      calculationId: d365.calculationReference
    }
    delete transformedD365.calculationReference

    await validateD365(transformedD365)
    await messageQueue.add(MessageTypes.D365, transformedD365)
    await messageQueue.process()
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
module.exports = processD365
