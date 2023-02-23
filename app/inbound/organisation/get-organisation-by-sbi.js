const db = require('../../data')

const getOrganisationBySbi = async (sbi, transaction) => {
  return db.organisation.findOne({
    transaction,
    lock: true,
    where: {
      sbi
    }
  })
}

module.exports = getOrganisationBySbi
