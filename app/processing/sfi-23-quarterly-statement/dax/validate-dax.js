const schema = require('./schema')

const validateDax = (dax, paymentReference) => {
  const result = schema.validate(dax, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Dax record with the payment reference: ${paymentReference} does not have the required details data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateDax
