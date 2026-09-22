const { organisations } = require('../../../database')

const getOrganisationBySbi = async (sbi) => {
  const organisation = await organisations()
    .select(
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
    )
    .where({ sbi })
    .first()
  return organisation ?? null
}

module.exports = getOrganisationBySbi
