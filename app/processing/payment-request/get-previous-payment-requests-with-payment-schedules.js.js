const { getCompletedSchedule } = require('../schedule')
const getCompletedPaymentRequestByCorrelationId = require('./get-completed-payment-request-by-correlation-id')

const getPreviousPaymentRequestsWithPaymentSchedules = async (previousPaymentRequests, transaction) => {
  const previousPaymentRequestsWithSchedules = []

  for (const paymentRequest of previousPaymentRequests) {
    let completedPaymentRequest = null
    let completedSchedule = null

    try {
      if (paymentRequest.paymentRequestNumber !== 1) {
        completedPaymentRequest = await getCompletedPaymentRequestByCorrelationId(paymentRequest.correlationId, transaction)
      }
    } catch (error) {
      console.error(`Error fetching completed payment request: ${error.message}`)
    }

    try {
      if (completedPaymentRequest) {
        completedSchedule = await getCompletedSchedule(completedPaymentRequest.paymentRequestId, transaction)
      }
    } catch (error) {
      console.error(`Error fetching completed schedule: ${error.message}`)
    }

    if (paymentRequest.paymentRequestNumber === 1 || (completedPaymentRequest && completedSchedule)) {
      previousPaymentRequestsWithSchedules.push(paymentRequest)
    }
  }

  return previousPaymentRequestsWithSchedules
}

module.exports = getPreviousPaymentRequestsWithPaymentSchedules
