const getOrganisation = require('../organisation')

const getDetails = async (sbi, transaction) => {
  const organisation = await getOrganisation(sbi, transaction)
  return {
    businessName: organisation.businessName,
    email: organisation.email,
    frn: Number(organisation.frn),
    sbi: Number(organisation.sbi)
  }
}

module.exports = getDetails
