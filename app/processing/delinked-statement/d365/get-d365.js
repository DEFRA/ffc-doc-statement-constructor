const getD365ByPaymentReference = require('./get-d365-by-payment-reference')
const validateD365 = require('./validate-d365')

const getD365 = async (paymentReference) => {
  const d365 = await getD365ByPaymentReference(paymentReference)
  return validateD365(d365, paymentReference)
}

module.exports = getD365
