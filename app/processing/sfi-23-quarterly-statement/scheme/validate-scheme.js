const schema = require('./schema')

const validateScheme = (scheme, code) => {
  const result = schema.validate(scheme, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Scheme with the Code: ${code} does not have the required details data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateScheme
