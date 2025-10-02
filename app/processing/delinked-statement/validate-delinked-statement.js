const { dataProcessingAlert } = require('ffc-alerting-utils')
const schema = require('./delinked-statement-schema')
const { DATA_PROCESSING_ERROR } = require('../../constants/alerts')
const { VALIDATION } = require('../../constants/validation')

const publishValidationAlert = async (delinkedStatement, validationError) => {
  try {
    await dataProcessingAlert({
      process: 'validateDelinkedStatement',
      error: validationError.message,
      message: `Delinked statement with the CalculationId: ${delinkedStatement.calculationId} does not have the required data`
    }, DATA_PROCESSING_ERROR)
  } catch (error) {
    console.error(`Delinked statement with the CalculationId: ${delinkedStatement.calculationId} does not have the required details data:`,
      { originalError: validationError.message, alertError: error }
    )
  }
}

const validateDelinkedStatement = async (delinkedStatement) => {
  const result = schema.validate(delinkedStatement, {
    abortEarly: false
  })
  if (result.error) {
    await publishValidationAlert(delinkedStatement, result.error)
    const error = new Error(`Delinked statement with the CalculationId: ${delinkedStatement.calculationId} does not have the required details data: ${result.error.message}`)
    error.category = VALIDATION
    throw error
  }

  return result.value
}

module.exports = validateDelinkedStatement
