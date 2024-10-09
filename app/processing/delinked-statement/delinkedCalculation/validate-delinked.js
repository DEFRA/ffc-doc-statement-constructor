const schema = require('./schema')

const validateDelinked = (delinked, calculationId) => {
  const result = schema.validate(delinked, {
    abortEarly: false
  })
  if (result.error) {
    throw new Error(`Delinked with the CalculationId: ${calculationId} does not have the required details data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateDelinked
