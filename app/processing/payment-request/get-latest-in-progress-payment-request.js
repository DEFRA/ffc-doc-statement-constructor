const getCompletedPaymentRequestByPaymentRequestId = require('./get-completed-payment-request-by-payment-request-id')
const getInProgressPaymentRequest = require('./get-in-progress-payment-request')
const getLatestCompletedPaymentRequest = require('./get-latest-completed-payment-request')
const validatePaymentRequest = require('./validate-payment-request')
const mapPaymentRequest = require('./map-payment-request')

const getLatestInProgressPaymentRequest = async (paymentRequestId, settlementDate, transaction) => {
  const completedPaymentRequest = await getCompletedPaymentRequestByPaymentRequestId(paymentRequestId, transaction)
  const inProgressPaymentRequest = await getInProgressPaymentRequest(completedPaymentRequest.correlationId, transaction)
  const latestCompletedPaymentRequest = await getLatestCompletedPaymentRequest(settlementDate, completedPaymentRequest.agreementNumber, completedPaymentRequest.marketingYear, transaction)
  const latestInProgressPaymentRequest = await getInProgressPaymentRequest(latestCompletedPaymentRequest.correlationId, transaction)
  latestInProgressPaymentRequest.originalValue = inProgressPaymentRequest.value
  return mapPaymentRequest(validatePaymentRequest(latestInProgressPaymentRequest))
}

module.exports = getLatestInProgressPaymentRequest
