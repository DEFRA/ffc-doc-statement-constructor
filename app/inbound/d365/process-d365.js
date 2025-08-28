const db = require('../../data')
const saveD365 = require('./save-d365')
const validateD365 = require('./validate-d365')
const getD365ByPaymentReference = require('./get-d365-by-payment-reference')
const { D365 } = require('../../constants/types')
const { retryOnFkError } = require('../../utility/retry-fk-error')
const { dataProcessingAlert } = require('../../utility/processing-alerts')
const { DATA_PROCESSING_ERROR } = require('../../constants/alerts')

const processD365 = async (d365) => {
  try {
    const transformedD365 = {
      paymentReference: d365.paymentReference,
      calculationId: d365.calculationReference,
      paymentPeriod: d365.paymentPeriod,
      marketingYear: d365.marketingYear,
      paymentAmount: d365.paymentAmount,
      transactionDate: d365.transactionDate || new Date(),
      type: D365
    }

    validateD365(transformedD365, transformedD365.paymentReference)

    const existingD365 = await getD365ByPaymentReference(d365.paymentReference)
    if (existingD365) {
      console.info(`Duplicate D365 paymentReference received, skipping ${existingD365.paymentReference}`)
      return
    }

    await retryOnFkError(async () => {
      const transaction = await db.sequelize.transaction()
      try {
        await saveD365(transformedD365, transaction)
        await transaction.commit()
        console.log(`Successfully committed D365: ${transformedD365.paymentReference}`)
      } catch (error) {
        await transaction.rollback()
        throw error
      }
    }, 'D365', transformedD365.paymentReference)
  } catch (error) {
    console.error(`Failed to process D365 ${d365?.paymentReference || 'unknown'}:`, error)
    try {
      await dataProcessingAlert({
        process: 'process-d365',
        paymentReference: d365?.paymentReference,
        paymentAmount: d365?.paymentAmount,
        transactionDate: d365?.transactionDate || new Date(),
        error
      }, DATA_PROCESSING_ERROR)
    } catch (alertErr) {
      console.error('Failed to publish processing alert for D365', alertErr)
    }
    throw error
  }
}

module.exports = processD365
