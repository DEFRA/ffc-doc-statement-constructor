const db = require('../../data')
const saveTotal = require('./save-total')
const saveActions = require('./save-actions')

const processTotal = async (total) => {
  const transaction = await db.sequelize.transaction()
  try {
    await saveTotal(total, transaction)
    await saveActions(total, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processTotal
