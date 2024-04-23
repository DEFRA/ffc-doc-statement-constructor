const db = require('../../../data')

const getTotalByCalculationId = async (calculationId) => {
  return db.total.findOne({
    attributes: [
      'agreementNumber',
      ['calculationId', 'calculationReference'],
      ['claimId', 'claimReference'],
      ['schemeType', 'schemeCode'],
      'sbi',
      'calculationDate',
      'invoiceNumber',
      'agreementStart',
      'agreementEnd',
      'totalAdditionalPayments',
      'totalActionPayments',
      'totalPayments'
    ],
    where: {
      calculationId
    },
    raw: true
  })
}

module.exports = getTotalByCalculationId
