const { getCompletedSchedule } = require('../schedule')
const getCompletedPaymentRequestByCorrelationId = require('./get-completed-payment-request-by-correlation-id')

const getPreviousPaymentRequestsWithPaymentSchedules = async (previousPaymentRequests, transaction) => {
  const previousPaymentRequestsWithSchedules = []

  for (const paymentRequest of previousPaymentRequests) {
    if (paymentRequest.paymentRequestNumber === 1) {
      previousPaymentRequestsWithSchedules.push(paymentRequest)
      continue
    }

    const completedPaymentRequest = await getCompletedPaymentRequestByCorrelationId(paymentRequest.correlationId, transaction)
    if (!completedPaymentRequest) continue

    const completedSchedule = await getCompletedSchedule(completedPaymentRequest.paymentRequestId, transaction)
    if (!completedSchedule) continue

    previousPaymentRequestsWithSchedules.push(paymentRequest)
  }

  return previousPaymentRequestsWithSchedules
}

module.exports = getPreviousPaymentRequestsWithPaymentSchedules
