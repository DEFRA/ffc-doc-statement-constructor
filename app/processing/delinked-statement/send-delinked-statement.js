const { dataProcessingAlert } = require('ffc-alerting-utils')
const publishDelinkedStatement = require('./publish-delinked-statement')
const { DATA_PROCESSING_ERROR } = require('../../../app/constants/alerts')

const sendDelinkedStatement = async (delinkedStatement) => {
  try {
    await publishDelinkedStatement(delinkedStatement)
  } catch (err) {
    try {
      await dataProcessingAlert({
        process: 'sendDelinkedStatement',
        paymentReference: delinkedStatement?.paymentReference,
        error: err,
        message: `Failed to send statement for D365 Payment Reference: ${delinkedStatement.paymentReference}`
      }, DATA_PROCESSING_ERROR)
    } catch (error) {
      console.error(`Failed to send statement for D365 Payment Reference: ${delinkedStatement.paymentReference}`,
        { originalError: err, alertError: error }
      )
    }
    throw new Error(`Failed to send statement for D365 Payment Reference: ${delinkedStatement.paymentReference}`,
      { cause: err }
    )
  }
}

module.exports = sendDelinkedStatement
