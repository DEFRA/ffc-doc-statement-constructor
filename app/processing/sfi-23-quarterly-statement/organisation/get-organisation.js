const getOrganisationBySbi = require('./get-organisation-by-sbi')
const validateOrganisation = require('./validate-organisation')

const getOrganisation = async (sbi) => {
  const organisation = await getOrganisationBySbi(sbi)
  return validateOrganisation(organisation, sbi)
}

module.exports = getOrganisation
