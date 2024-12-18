const db = require('../../data')
const { messageQueue, MessageTypes } = require('../../message-queue/delinked-message-queue')
const getDelinkedByCalculationId = require('./get-delinked-by-calculation-id')
const validateDelinked = require('./validate-delinked')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')

const processDelinked = async (delinked) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingDelinked = await getDelinkedByCalculationId(delinked.calculationReference, transaction)
    if (existingDelinked) {
      console.info(`Duplicate delinked received, skipping ${existingDelinked.calculationId}`)
      await transaction.rollback()
      return
    }

    await savePlaceholderOrganisation({ sbi: delinked.sbi }, delinked.sbi)

    const transformedDelinked = {
      ...delinked,
      calculationId: delinked.calculationReference,
      applicationId: delinked.applicationReference
    }
    delete transformedDelinked.calculationReference
    delete transformedDelinked.applicationReference

    await validateDelinked(transformedDelinked)

    await messageQueue.add(MessageTypes.ORGANISATION, {
      sbi: transformedDelinked.sbi,
      name: transformedDelinked.businessName,
      frn: transformedDelinked.frn
    })

    await messageQueue.add(MessageTypes.DELINKED_CALCULATION, transformedDelinked)

    await messageQueue.add(MessageTypes.D365, {
      paymentReference: transformedDelinked.paymentReference,
      calculationId: transformedDelinked.calculationId,
      paymentAmount: transformedDelinked.paymentAmount
    })

    await messageQueue.process()
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
module.exports = processDelinked
