const db = require('../../data')

const saveAction = async (actions, calculationId, transaction) => {
  for (const action of actions) {
    await db.action.create({ ...action, calculationId }, { transaction })
  }
}

module.exports = saveAction
