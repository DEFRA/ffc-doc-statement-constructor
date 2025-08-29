const schema = require('./schema')
const { dataProcessingAlert } = require('../../../utility/processing-alerts')
const { DATA_PROCESSING_ERROR } = require('../../../../app/constants/alerts')

const validateD365 = (d365, paymentReference) => {
  const result = schema.validate(d365, {
    abortEarly: false
  })

  if (result.error) {
    const errorMessage = result.error && result.error.message ? result.error.message : String(result.error)

    dataProcessingAlert({
      process: 'validateD365',
      paymentReference,
      error: result.error.message,
      message: `D365 record with the payment reference: ${paymentReference} does not have the required details data`
    }, DATA_PROCESSING_ERROR).catch((alertErr) => {
      console.error(`D365 record with the payment reference: ${paymentReference} does not have the required details data`,
        { originalError: result.error.message, alertError: alertErr }
      )
    })

    throw new Error(`D365 record with the payment reference: ${paymentReference} does not have the required details data: ${errorMessage}`
    )
  }

  return result.value
}

module.exports = validateD365
