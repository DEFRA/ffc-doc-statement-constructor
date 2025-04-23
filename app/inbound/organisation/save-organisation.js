const db = require('../../data')

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

  return db.organisation.upsert(organisationRecord, {
    transaction,
    raw: true
  })
}

module.exports = saveOrganisation
