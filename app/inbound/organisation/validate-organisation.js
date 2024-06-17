const schema = require('./schema')

const validateOrganisation = (organisation, sbi) => {
  const result = schema.validate(organisation, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Organisation validation on sbi: ${sbi} does not have the required organisation data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateOrganisation
