const { getCompletedSchedule } = require('../schedule')
const getCompletedPaymentRequestByCorrelationId = require('./get-completed-payment-request-by-correlation-id')

const getPreviousPaymentRequestsWithPaymentSchedules = async (previousPaymentRequests, transaction) => {
  const previousPaymentRequestsWithSchedules = []

  for (const paymentRequest of previousPaymentRequests) {
    // Always allow first payment request so we always have a payment request to compare against
    if (paymentRequest.paymentRequestNumber === 1) {
      previousPaymentRequestsWithSchedules.push(paymentRequest)
    } else {
      const completedPaymentRequest = await getCompletedPaymentRequestByCorrelationId(paymentRequest.correlationId, transaction)
      if (completedPaymentRequest) {
        const completedSchedule = await getCompletedSchedule(completedPaymentRequest.paymentRequestId, transaction)
        if (completedSchedule) {
          previousPaymentRequestsWithSchedules.push(paymentRequest)
        }
      }
    }
  }
  return previousPaymentRequestsWithSchedules
}

module.exports = getPreviousPaymentRequestsWithPaymentSchedules
