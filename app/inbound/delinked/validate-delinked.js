const schema = require('./schema')

const validateDelinked = (delinked, calculationId) => {
  const result = schema.validate(delinked, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Total with calculationId: ${calculationId} does not have the required DELINKED data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateDelinked
