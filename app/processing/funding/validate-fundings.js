const schema = require('./schema')

const validateFundings = (fundings, calculationId) => {
  const result = schema.validate(fundings, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Calculation with calculationId: ${calculationId} does not have valid funding(s): ${result.error.message}`)
  }

  return fundings
}

module.exports = validateFundings
