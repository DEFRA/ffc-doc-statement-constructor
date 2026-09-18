const { delinkedCalculations } = require('../../../data')

const getDelinkedByCalculationId = async (calculationId) => {
  const delinked = await delinkedCalculations()
    .select(
      'calculationId',
      'applicationId',
      'sbi',
      'frn',
      'paymentBand1',
      'paymentBand2',
      'paymentBand3',
      'paymentBand4',
      'percentageReduction1',
      'percentageReduction2',
      'percentageReduction3',
      'percentageReduction4',
      'progressiveReductions1',
      'progressiveReductions2',
      'progressiveReductions3',
      'progressiveReductions4',
      'referenceAmount',
      'totalProgressiveReduction',
      'totalDelinkedPayment',
      'paymentAmountCalculated'
    )
    .where({ calculationId })
    .first()
  return delinked ?? null
}
module.exports = getDelinkedByCalculationId
