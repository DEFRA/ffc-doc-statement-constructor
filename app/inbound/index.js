const processProcessingPaymentRequest = require('./processing/process-processing-payment-request')
const processStatementData = require('./statement-data/process-statement-data')
const processSubmitPaymentRequest = require('./submit/process-submit-payment-request')
const processReturnSettlement = require('./return/process-return-settlement')

module.exports = {
  processProcessingPaymentRequest,
  processStatementData,
  processSubmitPaymentRequest,
  processReturnSettlement
}
