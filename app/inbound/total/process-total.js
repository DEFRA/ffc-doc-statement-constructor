const db = require('../../data')
const saveTotal = require('./save-total')
const saveAction = require('./save-action')

const processTotal = async (total) => {
  const transaction = await db.sequelize.transaction()
  try {
    await saveTotal(total, transaction)
    await saveAction(total.action, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processTotal
