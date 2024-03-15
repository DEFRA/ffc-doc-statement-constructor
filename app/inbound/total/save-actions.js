const db = require('../../data')

const saveAction = async (actions, transaction) => {
  for (const action in actions) {
    const actionCalculationIdConvert = {
      ...actions,
      actionId: action.actionReference,
      calculationId: action.calculationReference
    }
    const actionClaimIdConvert = {
      ...actions,
      actionId: action.actionReference,
      calculationId: action.calculationReference
    }

    delete action.calculationReference
    delete action.claimReference

    await db.action.upsert(actionCalculationIdConvert, actionClaimIdConvert, { transaction })
  }
  return null
}

module.exports = saveAction
