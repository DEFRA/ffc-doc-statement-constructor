const db = require('../../data')

const saveAction = async (action, transaction) => {
  await db.action.upsert(action, { transaction })
}

module.exports = saveAction
