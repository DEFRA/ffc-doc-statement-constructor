const db = require('../../data')
const getDaxsForSfi23QuarterlyStatement = require('./get-daxs-for-sfi-23-quarterly-statement')
const updateDaxsForStartPublish = require('./update-daxs-for-start-publish')

const getVerifiedDaxsSfi23QuarterlyStatements = async () => {
  const transaction = await db.sequelize.transaction()
  try {
    const daxs = await getDaxsForSfi23QuarterlyStatement(transaction)
    await updateDaxsForStartPublish(daxs, transaction)
    await transaction.commit()
    return daxs
  } catch (err) {
    await transaction.rollback()
    console.error('Could not start sfi-23 quarterly statements', err)
    return []
  }
}

module.exports = getVerifiedDaxsSfi23QuarterlyStatements
