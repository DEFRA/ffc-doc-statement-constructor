const { totals } = require('../../../database')

const getTotalByCalculationId = async (calculationId) => {
  const total = await totals()
    .select({
      calculationReference: 'calculationId',
      claimReference: 'claimId',
      schemeCode: 'schemeType'
    },
    'agreementNumber',
    'sbi',
    'calculationDate',
    'invoiceNumber',
    'agreementStart',
    'agreementEnd',
    'totalAdditionalPayments',
    'totalActionPayments',
    'totalPayments'
    )
    .where({ calculationId })
    .first()
  return total ?? null
}

module.exports = getTotalByCalculationId
