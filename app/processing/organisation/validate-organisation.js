const schema = require('./schema')
const { dataProcessingAlert } = require('ffc-alerting-utils')
const { DATA_PROCESSING_ERROR } = require('../../../app/constants/alerts')
const validateOrganisation = (organisation, sbi, options = {}) => {
  const { delinked = false } = options

  const result = schema.validate(organisation, {
    abortEarly: false
  })

  if (result.error) {
    const errorMessage = result.error?.message ?? String(result.error)
    const processName = `validateOrganisation${delinked ? ' (Delinked)' : ''}`

    dataProcessingAlert({
      process: processName,
      sbi,
      error: errorMessage,
      message: `Organisation with the sbi: ${sbi} does not have the required details data`
    }, DATA_PROCESSING_ERROR).catch((alertErr) => {
      console.error(
        `Organisation with the sbi: ${sbi} does not have the required details data:`,
        { originalError: errorMessage, alertError: alertErr }
      )
    })

    throw new Error(`Organisation with the sbi: ${sbi} does not have the required details data: ${errorMessage}`)
  }

  return result.value
}

module.exports = validateOrganisation
