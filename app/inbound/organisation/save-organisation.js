const { organisations } = require('../../database')

const saveOrganisation = async (organisation, transaction) => {
  const organisationRecord = {
    sbi: organisation.sbi,
    addressLine1: organisation.addressLine1,
    addressLine2: organisation.addressLine2,
    addressLine3: organisation.addressLine3,
    city: organisation.city,
    county: organisation.county,
    emailAddress: organisation.emailAddress,
    frn: organisation.frn,
    name: organisation.name,
    postcode: organisation.postcode,
    updated: organisation.updated || new Date()
  }

  return organisations(transaction)
    .insert(organisationRecord)
    .onConflict('sbi')
    .merge()
}

module.exports = saveOrganisation
