const schema = require('./delinked-statement-schema')
const { dataProcessingAlert } = require('../../utility/processing-alerts')
const { DATA_PROCESSING_ERROR } = require('../../constants/alerts')

const validateDelinkedStatement = async (delinkedStatement) => {
  const result = schema.validate(delinkedStatement, {
    abortEarly: false
  })
  if (result.error) {
    dataProcessingAlert({
      process: 'validateDelinkedStatement',
      error: result.error.message,
      message: `Delinked statement with the CalculationId: ${delinkedStatement.calculationId} does not have the required data`
    }, DATA_PROCESSING_ERROR).catch((alertErr) => {
      console.error(`Delinked statement with the CalculationId: ${delinkedStatement.calculationId} does not have the required details data:`,
        { originalError: result.error.message, alertError: alertErr }
      )
    })
    throw new Error(`Delinked statement with the CalculationId: ${delinkedStatement.calculationId} does not have the required details data: ${result.error.message}`
    )
  }

  return result.value
}

module.exports = validateDelinkedStatement
