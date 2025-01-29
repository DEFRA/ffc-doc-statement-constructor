jest.mock('../../../../app/processing/payment-request/get-completed-payment-request-by-correlation-id')
const getCompletedPaymentRequestByCorrelationId = require('../../../../app/processing/payment-request/get-completed-payment-request-by-correlation-id')

const { getPreviousPaymentRequestsWithPaymentSchedules } = require('../../../../app/processing/payment-request')

let paymentRequest
let previousPaymentRequests

describe('get previous payment requests with payment schedules', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    previousPaymentRequests = []
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    getCompletedPaymentRequestByCorrelationId.mockResolvedValue(undefined)
  })

  test('should return empty array when no previousPaymentRequests', async () => {
    const result = await getPreviousPaymentRequestsWithPaymentSchedules(previousPaymentRequests)
    expect(result).toStrictEqual(previousPaymentRequests)
  })

  test('should return first payment request even though first payment has not constructed schedule', async () => {
    previousPaymentRequests.push(paymentRequest)
    const result = await getPreviousPaymentRequestsWithPaymentSchedules(previousPaymentRequests)
    expect(result).toStrictEqual(previousPaymentRequests)
  })

  test('should return first payment request when second payment request has no completed request and no constructed schedule', async () => {
    previousPaymentRequests.push(paymentRequest)
    const secondPaymentRequest = { ...paymentRequest }
    secondPaymentRequest.paymentRequestNumber = 2
    previousPaymentRequests.push(secondPaymentRequest)
    const result = await getPreviousPaymentRequestsWithPaymentSchedules(previousPaymentRequests)
    expect(result).toContain(previousPaymentRequests[0])
    expect(result).toHaveLength(1)
  })

  test('should return first payment request when second payment request has completed request but no constructed schedule', async () => {
    previousPaymentRequests.push(paymentRequest)
    const secondPaymentRequest = { ...paymentRequest }
    secondPaymentRequest.paymentRequestNumber = 2
    previousPaymentRequests.push(secondPaymentRequest)
    getCompletedPaymentRequestByCorrelationId.mockResolvedValue(secondPaymentRequest)
    const result = await getPreviousPaymentRequestsWithPaymentSchedules(previousPaymentRequests)
    expect(result).toContain(previousPaymentRequests[0])
    expect(result).toHaveLength(1)
  })

  test('should return first and second payment request when second payment request has completed request and constructed schedule', async () => {
    previousPaymentRequests.push(paymentRequest)
    const secondPaymentRequest = { ...paymentRequest }
    secondPaymentRequest.paymentRequestNumber = 2
    previousPaymentRequests.push(secondPaymentRequest)
    getCompletedPaymentRequestByCorrelationId.mockResolvedValue(secondPaymentRequest)

    const result = await getPreviousPaymentRequestsWithPaymentSchedules(previousPaymentRequests)
    expect(result).toContain(previousPaymentRequests[0])

    expect(result).toHaveLength(1)
  })
})
