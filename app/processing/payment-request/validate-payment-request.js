const util = require('util')
const schema = require('./schema')

const validatePaymentRequest = (paymentRequest) => {
  const result = schema.validate(paymentRequest, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Payment request: ${util.inspect(paymentRequest, false, null, true)} does not have the required data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validatePaymentRequest
