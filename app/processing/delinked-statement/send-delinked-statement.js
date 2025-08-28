const publishDelinkedStatement = require('./publish-delinked-statement')
const { dataProcessingAlert } = require('../../../app/utility/processing-alerts')
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
    } catch (alertErr) {
      console.error(`Failed to send statement for D365 Payment Reference: ${delinkedStatement.paymentReference}`, err)
    }
    throw new Error(`Failed to send statement for D365 Payment Reference: ${delinkedStatement.paymentReference}`, err)
  }
}

module.exports = sendDelinkedStatement
