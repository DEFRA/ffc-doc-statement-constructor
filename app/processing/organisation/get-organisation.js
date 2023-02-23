const getOrganisationBySbi = require('./get-organisation-by-sbi')
const validateOrganisation = require('./validate-organisation')
const mapOrganisation = require('./map-organisation')

const getOrganisation = async (sbi, transaction) => {
  const organisation = await getOrganisationBySbi(sbi, transaction)
  return mapOrganisation(validateOrganisation(organisation, sbi))
}

module.exports = getOrganisation
