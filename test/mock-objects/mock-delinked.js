const { DATE: UPDATED_TIMESTAMP } = require('../mock-components/mock-dates').UPDATED

const mockDelinked1 = {
  calculationId: 124876565,
  applicationId: 1829487,
  calculationReference: 124876565,
  applicationReference: 1829487,
  sbi: 110100001,
  frn: 1000000001,
  paymentBand1: 'Up to £30,000',
  paymentBand2: '£30,000.01 to £50,000',
  paymentBand3: '£50,000.01 to £150,000',
  paymentBand4: 'Above £150,000',
  percentageReduction1: '50%',
  percentageReduction2: '55%',
  percentageReduction3: '65%',
  percentageReduction4: '0%',
  progressiveReductions1: '£15,000',
  progressiveReductions2: '£11,000',
  progressiveReductions3: '£48,750',
  progressiveReductions4: '£0',
  referenceAmount: '125,000',
  totalProgressiveReduction: '74,750',
  totalDelinkedPayment: '50,250',
  paymentAmountCalculated: '25,125',
  datePublished: UPDATED_TIMESTAMP,
  type: 'delinkedCalculation'
}
const mockDelinked2 = {
  calculationId: 124876565,
  applicationId: 1829487,
  sbi: 110100001,
  frn: 1000000001,
  paymentBand1: 'Up to £30,000',
  paymentBand2: '£30,000.01 to £50,000',
  paymentBand3: '£50,000.01 to £150,000',
  paymentBand4: 'Above £150,000',
  percentageReduction1: '50%',
  percentageReduction2: '55%',
  percentageReduction3: '65%',
  percentageReduction4: '0%',
  progressiveReductions1: '£15,000',
  progressiveReductions2: '£11,000',
  progressiveReductions3: '£48,750',
  progressiveReductions4: '£0',
  referenceAmount: '125,000',
  totalProgressiveReduction: '74,750',
  totalDelinkedPayment: '50,250',
  paymentAmountCalculated: '25,125',
  datePublished: UPDATED_TIMESTAMP,
  type: 'delinkedCalculation'
}

module.exports = { mockDelinked1, mockDelinked2 }
