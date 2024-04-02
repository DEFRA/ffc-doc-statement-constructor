const db = require('../../data')

const saveAction = async (actions, transaction) => {
  for (const action of actions) {
    const transformedAction = {
      ...action,
      actionId: action.actionReference,
      calculationId: action.calculationReference
    }

    delete transformedAction.actionReference
    delete transformedAction.calculationReference

    await db.action.create(transformedAction, { transaction })
  }
}

module.exports = saveAction
