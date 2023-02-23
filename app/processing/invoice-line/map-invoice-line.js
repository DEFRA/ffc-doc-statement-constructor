const getReductions = require('./get-reductions')
const QUARTER = 0.25
const MIN_PAYMENT_VALUE = 0

const mapInvoiceLine = async (grossValueInvoiceLine, fundingCode, paymentRequestId) => {
  const { reductions, annualReduction } = await getReductions(fundingCode, paymentRequestId)
  const annualValue = grossValueInvoiceLine.value
  const quarterlyValue = annualValue > MIN_PAYMENT_VALUE ? annualValue * QUARTER : MIN_PAYMENT_VALUE
  const quarterlyReduction = annualReduction * QUARTER
  const quarterlyPayment = quarterlyValue - quarterlyReduction

  return {
    annualValue,
    quarterlyValue,
    quarterlyReduction,
    quarterlyPayment,
    reductions
  }
}
module.exports = mapInvoiceLine
