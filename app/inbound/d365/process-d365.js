const db = require('../../data')
const saveD365 = require('./save-d365')
const validateD365 = require('./validate-d365')
const getD365ByPaymentReference = require('./get-d365-by-payment-reference')
const { D365 } = require('../../constants/types')

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

    const transaction = await db.sequelize.transaction()

    async function waitForCalculationReference(id, maxPollingWaitMs = 5000, pollingIntervalMs = 250){
      const startPollingTime = Date.now();
      while ((Date.now() - startPollingTime) < maxPollingWaitMs){
        var doesCalcExist = await db.DelinkedCalculation.findByPk(id);
        if(doesCalcExist){
          return doesCalcExist;
        }
        await new Promise(res => setTimeout(res, pollingIntervalMs));
      }
      throw new Error("Polling Timeout Error: calculationReference was not resolved within the timeout period.");
    }

    try {
      await waitForCalculationReference(transformedD365.calculationReference);
      await saveD365(transformedD365, transaction)
      await transaction.commit()

      console.log(`Successfully committed D365: ${transformedD365.paymentReference}`)
    } catch (error) {
      console.error(`Transaction error for D365 ${transformedD365.paymentReference}:`, error)
      await transaction.rollback()
      throw error
    }
  } catch (error) {
    console.error(`Failed to process D365 ${d365?.paymentReference || 'unknown'}:`, error)
    throw error
  }
}

module.exports = processD365
