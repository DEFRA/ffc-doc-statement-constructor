const getPositiveInvoiceLineByFundingCodeAndPaymentRequestId = require('./get-positive-invoice-line-by-funding-code-and-payment-request-id')
const validateInvoiceLine = require('./validate-invoice-line')
const mapInvoiceLine = require('./map-invoice-line')

const getInvoiceLine = async (fundingCode, paymentRequestId) => {
  const grossValueInvoiceLine = await getPositiveInvoiceLineByFundingCodeAndPaymentRequestId(fundingCode, paymentRequestId)
  return mapInvoiceLine(validateInvoiceLine(grossValueInvoiceLine, fundingCode, paymentRequestId), fundingCode, paymentRequestId)
}

module.exports = getInvoiceLine
