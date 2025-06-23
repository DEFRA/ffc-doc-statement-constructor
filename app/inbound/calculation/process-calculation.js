const db = require('../../data')
const getCalculationByCalculationReference = require('./get-calculation-by-calculation-reference')
const saveCalculation = require('./save-calculation')
const saveFundings = require('./save-fundings')
const saveOrganisation = require('./save-placeholder-organisation')

const processCalculation = async (calculation) => {
  const transaction = await db.sequelize.transaction()

  async function waitForCalculationReference(id, maxPollingWaitMs = 5000, pollingIntervalMs = 250) {
    const startPollingTime = Date.now();
    console.log("Polling calculation.");
    while ((Date.now() - startPollingTime) < maxPollingWaitMs) {
      var doesCalcExist = await db.calculation.findByPk(id);
      if (doesCalcExist) {
        return doesCalcExist;
      }
      await new Promise(res => setTimeout(res, pollingIntervalMs));
    }
    throw new Error("Polling Timeout Error: calculationReference was not resolved within the timeout period.");
  }

  try {
    const existingCalculation = await getCalculationByCalculationReference(calculation.calculationReference, transaction);
    if (existingCalculation) {
      console.info(`Duplicate calculation received, skipping ${existingCalculation.calculationReference}`);
      await transaction.rollback();
    } else {
      validateOrganisation({ sbi: calculation.sbi }, calculation.sbi);
      await saveOrganisation({ sbi: calculation.sbi }, transaction);

      try {
        await waitForCalculationReference(calculation.calculationReference);
        const savedCalculation = await saveCalculation(calculation, transaction);
        await saveFundings(calculation.fundings, savedCalculation.calculationId, transaction);
        await transaction.commit();
      } catch (error) {
        console.error(`Transaction error for calculation ${calculation.calculationReference}:`, error);
        await transaction.rollback();
        throw error;
      }
    }
  } catch (error) {
    await transaction.rollback();
    throw (error);
  }
}

module.exports = processCalculation;
