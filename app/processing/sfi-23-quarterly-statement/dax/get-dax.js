const getDaxByPaymentReference = require('./get-dax-by-payment-reference')
const validateDax = require('./validate-dax')

const getDax = async (paymentReference) => {
  const dax = await getDaxByPaymentReference(paymentReference)
  return validateDax(dax, paymentReference)
}

module.exports = getDax
