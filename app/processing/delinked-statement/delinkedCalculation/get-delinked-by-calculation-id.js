const db = require('../../../data')

const getDelinkedByCalculationId = async (calculationId) => {
  return db.delinkedCalculation.findOne({
    attributes: [
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
    ],
    where: {
      calculationId
    },
    raw: true
  })
}
console.log('get-delinked-by-calculation-id', getDelinkedByCalculationId)
module.exports = getDelinkedByCalculationId
