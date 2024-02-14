const db = require('../../data')

const getAgreementNumberByClaimId = async (claimId) => {
  return db.claimAgreement.findOne({
    attributes: [
      'agreementNumber'
    ],
    where: {
      claimId
    },
    raw: true
  })
}

module.exports = getAgreementNumberByClaimId
