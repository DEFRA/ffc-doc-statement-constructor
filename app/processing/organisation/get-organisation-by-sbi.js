const { organisations } = require('../../database')

const getOrganisationBySbi = async (sbi, transaction) => {
  const organisation = await organisations(transaction)
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
