const schema = require('./schema')

const validateDelinked = (transformedDelinked, calculationId) => {
  const result = schema.validate(transformedDelinked, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Total with calculationId: ${calculationId} does not have the required DELINKED data: ${result.error.message}`)
  }
  return result.value
}

module.exports = validateDelinked
