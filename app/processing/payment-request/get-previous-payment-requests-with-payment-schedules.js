const { getCompletedSchedule } = require('../schedule')
const getCompletedPaymentRequestByCorrelationId = require('./get-completed-payment-request-by-correlation-id')

const processPaymentRequest = async (paymentRequest, transaction) => {
  let completedPaymentRequest = null
  let completedSchedule = null

  if (paymentRequest.paymentRequestNumber !== 1) {
    try {
      completedPaymentRequest = await getCompletedPaymentRequestByCorrelationId(paymentRequest.correlationId, transaction)
    } catch (error) {
      console.error(`Error fetching completed payment request: ${error.message}`)
      return null
    }
  }

  if (completedPaymentRequest) {
    try {
      completedSchedule = await getCompletedSchedule(completedPaymentRequest.paymentRequestId, transaction)
    } catch (error) {
      console.error(`Error fetching completed schedule: ${error.message}`)
      return null
    }
  }

  if (paymentRequest.paymentRequestNumber === 1 || (completedPaymentRequest && completedSchedule)) {
    return paymentRequest
  }

  return null
}

const getPreviousPaymentRequestsWithPaymentSchedules = async (previousPaymentRequests, transaction) => {
  const previousPaymentRequestsWithSchedules = []

  for (const paymentRequest of previousPaymentRequests) {
    const processedPaymentRequest = await processPaymentRequest(paymentRequest, transaction)
    if (processedPaymentRequest) {
      previousPaymentRequestsWithSchedules.push(processedPaymentRequest)
    }
  }

  return previousPaymentRequestsWithSchedules
}

module.exports = getPreviousPaymentRequestsWithPaymentSchedules
