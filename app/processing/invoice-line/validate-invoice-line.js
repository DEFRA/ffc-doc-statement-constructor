const schema = require('./schema')

const validateInvoiceLine = (invoiceLine, fundingCode, paymentRequestId) => {
  const result = schema.validate(invoiceLine, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required gross invoice-line data for funding code ${fundingCode} : ${result.error.message}`)
  }

  return result.value
}

module.exports = validateInvoiceLine
