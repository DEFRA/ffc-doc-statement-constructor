const db = require('../../data')
const getEmailDelinked = async (emailAddress, transaction) => {
  return db.delinkedCalculation.findOne({
    transaction,
    lock: true,
    where: {
      emailAddress
    }
  }
  )
}
module.exports = getEmailDelinked
