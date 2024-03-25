const schema = require('./schema')

const validateActions = (actions, calculationId) => {
  const result = schema.validate(actions, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Total with the CalculationId: ${calculationId} has one or more actions with invalid data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateActions
