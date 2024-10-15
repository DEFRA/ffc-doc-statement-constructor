const db = require('../../../data')

const getOrganisationBySbi = async (sbi) => {
  return db.organisation.findOne({
    attributes: [
      'sbi',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'city',
      'county',
      'emailAddress',
      'frn',
      'name',
      'postcode'
    ],
    where: {
      sbi
    },
    raw: true
  })
}

module.exports = getOrganisationBySbi
