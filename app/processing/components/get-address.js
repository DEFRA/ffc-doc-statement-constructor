const getOrganisation = require('../organisation')

const getAddress = async (sbi, transaction) => {
  const organisation = await getOrganisation(sbi, transaction)
  return {
    line1: organisation.line1,
    line2: organisation.line2,
    line3: organisation.line3,
    line4: organisation.line4,
    line5: organisation.line5,
    postcode: organisation.postcode
  }
}

module.exports = getAddress
