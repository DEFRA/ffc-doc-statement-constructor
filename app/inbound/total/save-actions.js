const { actions } = require('../../database')
const TABLES = require('../../constants/tables')
const { pickColumns } = require('../../constants/columns')

const saveAction = async (records, transaction) => {
  if (!records || records.length === 0) {
    return
  }

  const transformedActions = records.map(action => pickColumns({
    ...action,
    actionId: action.actionReference,
    calculationId: action.calculationReference
  }, TABLES.actions))

  await actions(transaction).insert(transformedActions)
}

module.exports = saveAction
