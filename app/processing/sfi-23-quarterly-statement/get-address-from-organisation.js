const getAddressFromOrganisation = (organisation) => {
  return {
    line1: organisation.addressLine1,
    line2: organisation.addressLine2,
    line3: organisation.addressLine3,
    line4: organisation.city,
    line5: organisation.county,
    postcode: organisation.postcode
  }
}

module.exports = getAddressFromOrganisation
