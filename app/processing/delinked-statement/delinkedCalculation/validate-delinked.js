const schema = require('./schema')
const { dataProcessingAlert } = require('ffc-alerting-utils')
const { DATA_PROCESSING_ERROR } = require('../../../../app/constants/alerts')

const validateDelinked = (delinked, calculationId) => {
  const result = schema.validate(delinked, {
    abortEarly: false
  })
  if (result.error) {
    dataProcessingAlert({
      process: 'validateDelinked',
      calculationId,
      error: result.error.message,
      message: `Delinked with the CalculationId: ${calculationId} does not have the required details data`
    }, DATA_PROCESSING_ERROR).catch((alertErr) => {
      console.error(`Delinked with the CalculationId: ${calculationId} does not have the required details data:`,
        { originalError: result.error.message, alertError: alertErr }
      )
    })
    throw new Error(`Delinked with the CalculationId: ${calculationId} does not have the required details data: ${result.error.message}`
    )
  }

  return result.value
}

module.exports = validateDelinked
