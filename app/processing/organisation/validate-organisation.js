const schema = require('./schema')
const { dataProcessingAlert } = require('../../../app/utility/processing-alerts')
const { DATA_PROCESSING_ERROR } = require('../../../app/constants/alerts')

const validateOrganisation = (organisation, sbi) => {
  const result = schema.validate(organisation, {
    abortEarly: false
  })

  if (result.error) {
    const errorMessage = result.error && result.error.message ? result.error.message : String(result.error)

    dataProcessingAlert({
      process: 'validateOrganisation',
      sbi,
      error: errorMessage,
      message: `Organisation with the sbi: ${sbi} does not have the required details data`
    }, DATA_PROCESSING_ERROR).catch((alertErr) => {
      console.error(`Organisation with the sbi: ${sbi} does not have the required details data:`,
        { originalError: errorMessage, alertError: alertErr }
      )
    })

    throw new Error(`Organisation with the sbi: ${sbi} does not have the required details data: ${errorMessage}`)
  }

  return result.value
}

module.exports = validateOrganisation
