const schema = require('./schema')

const validateD365 = (d365, paymentReference) => {
  const result = schema.validate(d365, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`D365 validation on paymentReference: ${paymentReference} does not have the required D365 data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateD365
