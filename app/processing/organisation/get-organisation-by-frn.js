const db = require('../../data')

const getOrganisationByFrn = async (frn, transaction) => {
  return db.organisation.findOne({
    transaction,
    attributes: [
      'sbi'
    ],
    where: {
      frn
    },
    raw: true
  })
}

module.exports = getOrganisationByFrn
