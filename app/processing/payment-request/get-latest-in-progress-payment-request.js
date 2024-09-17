const util = require('util')
const getCompletedPaymentRequestByPaymentRequestId = require('./get-completed-payment-request-by-payment-request-id')
const getInProgressPaymentRequest = require('./get-in-progress-payment-request')
const getLatestCompletedPaymentRequest = require('./get-latest-completed-payment-request')
const validatePaymentRequest = require('./validate-payment-request')
const mapPaymentRequest = require('./map-payment-request')

const getLatestInProgressPaymentRequest = async (paymentRequestId, settlementDate, transaction) => {
  const completedPaymentRequest = await getCompletedPaymentRequestByPaymentRequestId(paymentRequestId, transaction)
  console.log('Completed Payment Request:', util.inspect(completedPaymentRequest, false, null, true))
  const inProgressPaymentRequest = await getInProgressPaymentRequest(completedPaymentRequest.correlationId, transaction)
  console.log('In progress Payment Request:', util.inspect(inProgressPaymentRequest, false, null, true))
  const latestCompletedPaymentRequest = await getLatestCompletedPaymentRequest(settlementDate, completedPaymentRequest.agreementNumber, completedPaymentRequest.marketingYear, transaction)
  console.log('Latest Completed Payment Request:', util.inspect(latestCompletedPaymentRequest, false, null, true))
  const latestInProgressPaymentRequest = await getInProgressPaymentRequest(latestCompletedPaymentRequest.correlationId, transaction)
  console.log('Latest in progress Payment Request:', util.inspect(latestInProgressPaymentRequest, false, null, true))
  latestInProgressPaymentRequest.originalValue = inProgressPaymentRequest.value
  return mapPaymentRequest(validatePaymentRequest(latestInProgressPaymentRequest))
}

module.exports = getLatestInProgressPaymentRequest
