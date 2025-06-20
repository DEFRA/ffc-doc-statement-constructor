const db = require('../../data')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const getCalculationByCalculationReference = require('./get-calculation-by-calculation-reference')
const saveCalculation = require('./save-calculation')
const saveFundings = require('./save-fundings')

const processCalculation = async (calculation) => {
  try {

    const transaction = await db.sequelize.transaction();

    async function waitForCalculationReference(reference, maxPollingWaitMs = 5000, pollingIntervalMs = 250) {
      const startPollingTime = Date.now();
      console.log("Polling calculation reference.");
      while ((Date.now() - startPollingTime) < maxPollingWaitMs) {
        var existingCalculation = await getCalculationByCalculationReference(reference, transaction);
        if (existingCalculation) {
          return existingCalculation;
        }
        await new Promise(res => setTimeout(res, pollingIntervalMs));
      }
      throw new Error("Polling Timeout Error: calculationReference was not resolved within the timeout period.");
    }

    const existingCalculation = await getCalculationByCalculationReference(calculation.calculationReference, transaction);
    if (existingCalculation) {
      console.info(`Duplicate calculation received, skipping ${existingCalculation.calculationReference}`);
      await transaction.rollback();
      return;
    }

    try {
      await waitForCalculationReference(calculation.calculationReference);
      await savePlaceholderOrganisation({ sbi: calculation.sbi }, calculation.sbi);
      const savedCalculation = await saveCalculation(calculation, transaction);
      await saveFundings(calculation.fundings, savedCalculation.calculationId, transaction);
      await transaction.commit();
      console.log(`Successfully committed calculation: ${calculation.calculationReference}`);
    } catch (error) {
      console.error(`Transaction error for calculation ${calculation.calculationReference}:`, error);
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error(`Failed to process calculation ${calculation?.calculationReference || 'unknown'}:`, error);
    throw error;
  }
}

module.exports = processCalculation;
