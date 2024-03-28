const schema = require('./schema')

const validateTotal = (totals, calculationId) => {
  const result = schema.validate(totals, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Total with calculationId: ${calculationId} does not have the required TOTAL data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateTotal
