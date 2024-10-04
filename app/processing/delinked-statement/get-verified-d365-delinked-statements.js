const db = require('../../data')
const getD365ForDelinkedStatement = require('./get-d365-for-delinked-statement')
const updateD365ForStartPublish = require('./update-d365-for-start-publish')

const getVerifiedD365DelinkedStatements = async () => {
  const transaction = await db.sequelize.transaction()
  try {
    const d365 = await getD365ForDelinkedStatement(transaction)
    await updateD365ForStartPublish(d365, transaction)
    await transaction.commit()
    return d365
  } catch (err) {
    await transaction.rollback()
    console.error('Could not start delinked statements', err)
    return []
  }
}

module.exports = getVerifiedD365DelinkedStatements
