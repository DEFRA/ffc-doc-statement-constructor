const schema = require('./schema')

const validateTotal = (total, calculationId) => {
  const result = schema.validate(total, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Total with the CalculationId: ${calculationId} does not have the required details data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateTotal
