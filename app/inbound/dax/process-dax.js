const db = require('../../data')
const saveDax = require('./save-dax')

const processDax = async (dax) => {
  const transaction = await db.sequelize.transaction()
  try {
    await saveDax(dax, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processDax
