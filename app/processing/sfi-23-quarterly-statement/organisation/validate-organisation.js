const schema = require('./schema')

const validateOrganisation = (organisation, sbi) => {
  const result = schema.validate(organisation, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Organisation with the sbi: ${sbi} does not have the required details data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateOrganisation
