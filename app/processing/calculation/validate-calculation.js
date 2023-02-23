const schema = require('./schema')

const validateCalculation = (calculation, paymentRequestId) => {
  const result = schema.validate(calculation, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required Calculation data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateCalculation
