const getNegativeInvoiceLinesByFundingCodeAndPaymentRequestId = require('./get-negative-invoice-lines-by-funding-code-and-payment-request-id')
const schema = require('./schema')
const removeDescriptionPrefix = require('./remove-description-prefix')

const getReductions = async (fundingCode, paymentRequestId) => {
  const reductions = []
  let annualReduction = 0
  const reductionInvoiceLines = await getNegativeInvoiceLinesByFundingCodeAndPaymentRequestId(fundingCode, paymentRequestId)
  for (const reductionInvoiceLine of reductionInvoiceLines) {
    const result = schema.validate(reductionInvoiceLine, {
      abortEarly: false
    })
    if (result.error) {
      throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required reduction invoice-line data for funding code ${fundingCode} : ${result.error.message}`)
    }
    reductions.push({
      reason: removeDescriptionPrefix(reductionInvoiceLine.description),
      value: reductionInvoiceLine.value * -1
    })
    annualReduction += (reductionInvoiceLine.value * -1)
  }
  return { reductions, annualReduction }
}

module.exports = getReductions
