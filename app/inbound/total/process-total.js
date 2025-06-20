const db = require('../../data');
const getTotalByCalculationId = require('./get-total-by-calculation-id');
const savePlaceholderOrganisation = require('./save-placeholder-organisation');
const saveTotal = require('./save-total');
const saveActions = require('./save-actions');
const validateTotal = require('./validate-total');

const processTotal = async (total) => {
  const transaction = await db.sequelize.transaction();
  try {
    validateTotal(total, total.calculationReference);

    async function waitForCalculationReference(id, maxPollingWaitMs = 5000, pollingIntervalMs = 250) {
      const startPollingTime = Date.now();
      console.log("Polling calculation.");
      while ((Date.now() - startPollingTime) < maxPollingWaitMs) {
        const doesCalcExist = await db.total.findByPk(id);
        if (doesCalcExist) {
          return doesCalcExist;
        }
        await new Promise(res => setTimeout(res, pollingIntervalMs));
      }
      throw new Error("Polling Timeout Error: calculationReference was not resolved within the timeout period.");
    }

    await waitForCalculationReference(total.calculationReference);

    const existingTotal = await getTotalByCalculationId(total.calculationReference, transaction);
    if (existingTotal) {
      console.info(`Duplicate calculationId received, skipping ${existingTotal.calculationId}`);
      await transaction.rollback();
      return;
    }

    await savePlaceholderOrganisation({ sbi: total.sbi }, total.sbi);
    await saveTotal(total, transaction);
    await saveActions(total.actions, transaction);
    await transaction.commit();
    console.log(`Successfully committed Total: ${total.calculationReference}`);
  } catch (error) {
    console.error(`Failed to process Total ${total?.calculationReference || 'unknown'}:`, error);
    await transaction.rollback();
    throw error;
  }
};

module.exports = processTotal;