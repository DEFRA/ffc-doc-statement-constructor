const db = require('../../data')
const saveDax = require('./save-dax')
const validateDax = require('./validate-dax')
const getDaxByCalculationId = require('./get-dax-by-calculation-id')

const processDax = async (dax) => {
  try {

    validateDax(dax, dax.paymentReference);

    //const existingDax = await getDaxByPaymentReference(dax.paymentReference)
    //if (existingDax) {
    //  console.info(`Duplicate Dax paymentReference received, skipping ${existingDax.paymentReference}`)
    //  return;
    //}

    const transaction = await db.sequelize.transaction();

    async function waitForCalculationReference(id, maxPollingWaitMs = 5000, pollingIntervalMs = 250) {
      const startPollingTime = Date.now();
      console.log("Polling calculation.");
      while ((Date.now() - startPollingTime) < maxPollingWaitMs) {
        var doesCalcExist = await db.total.findByPk(id);
        if (doesCalcExist) {
          return doesCalcExist;
        }
        await new Promise(res => setTimeout(res, pollingIntervalMs));
      }
      throw new Error("Polling Timeout Error: calculationReference was not resolved within the timeout period.");
    }

    const existingDaxCalc = await getDaxByCalculationId(dax.calculationReference);
    if (existingDaxCalc) {
      console.info(`Duplicate Dax calculation ID received, skipping calculation ID ${existingDax.calculationId} for ${existingDax.paymentReference}`);
      await transaction.rollback();
      return;
    }

    try {
      await waitForCalculationReference(dax.calculationReference);
      await saveDax(dax, transaction);
      await transaction.commit();
      console.log(`Successfully committed Dax: ${dax.paymentReference}`);
    } catch (error) {
      console.error(`Transaction error for Dax ${dax.paymentReference}:`, error);
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error(`Failed to process Dax ${dax?.paymentReference || 'unknown'}:`, error);
    throw error;
  }
}

module.exports = processDax;
