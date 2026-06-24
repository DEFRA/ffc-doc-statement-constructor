const db = require('../../data')

const saveAction = async (actions, transaction) => {
  if (!actions || actions.length === 0) {
    return
  }

  const transformedActions = actions.map(action => {
    const transformedAction = {
      ...action,
      actionId: action.actionReference,
      calculationId: action.calculationReference
    }

    delete transformedAction.actionReference
    delete transformedAction.calculationReference

    return transformedAction
  })

  await db.action.bulkCreate(transformedActions, { transaction })
}

module.exports = saveAction
