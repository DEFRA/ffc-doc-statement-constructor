const schema = require('./schema')

const validateDax = (dax, paymentReference) => {
  const result = schema.validate(dax, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Dax validation on paymentReference: ${paymentReference} does not have the required DAX data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateDax
