const { LONG_NAMES, SHORT_NAMES } = require('../../constants/scheme-names')
const getAgreementNumberByClaimId = require('../agreementNumber/get-agreement-number-by-claim-id')

const getScheme = async (year, frequency, agreementNumber, sourceSystem) => {
  if (sourceSystem === SHORT_NAMES.SFIA) {
    const newAgreementNumber = await getAgreementNumberByClaimId(agreementNumber)
    if (!newAgreementNumber) {
      throw new Error(`SFIA claimId: ${agreementNumber} does not have corresponding agreementNumber`)
    }

    return {
      name: LONG_NAMES[sourceSystem],
      shortName: sourceSystem,
      year: String(year),
      frequency,
      agreementNumber: newAgreementNumber.agreementNumber
    }
  }

  return {
    name: LONG_NAMES[sourceSystem],
    shortName: sourceSystem,
    year: String(year),
    frequency,
    agreementNumber
  }
}

module.exports = getScheme
