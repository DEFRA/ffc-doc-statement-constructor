const { getCompletedSchedule } = require('../../../../app/processing/schedule')
const getCompletedPaymentRequestByCorrelationId = require('../../../../app/processing/payment-request/get-completed-payment-request-by-correlation-id')
const getPreviousPaymentRequestsWithPaymentSchedules = require('../../../../app/processing/payment-request/get-previous-payment-requests-with-payment-schedules')

jest.mock('../../../../app/processing/schedule', () => ({
  getCompletedSchedule: jest.fn()
}))
jest.mock('../../../../app/processing/payment-request/get-completed-payment-request-by-correlation-id', () => jest.fn())

describe('getPreviousPaymentRequestsWithPaymentSchedules', () => {
  beforeEach(() => {
    getCompletedSchedule.mockClear()
    getCompletedPaymentRequestByCorrelationId.mockClear()
  })

  test('should return payment requests with schedules', async () => {
    const paymentRequests = [
      { paymentRequestNumber: 1, correlationId: '123' },
      { paymentRequestNumber: 2, correlationId: '456' }
    ]
    const completedPaymentRequest = { paymentRequestId: '789' }
    const completedSchedule = { scheduleId: '101112' }

    getCompletedPaymentRequestByCorrelationId.mockResolvedValue(completedPaymentRequest)
    getCompletedSchedule.mockResolvedValue(completedSchedule)

    const result = await getPreviousPaymentRequestsWithPaymentSchedules(paymentRequests, {})

    expect(result).toEqual(paymentRequests)
    expect(getCompletedPaymentRequestByCorrelationId).toHaveBeenCalledWith(paymentRequests[1].correlationId, {})
    expect(getCompletedSchedule).toHaveBeenCalledWith(completedPaymentRequest.paymentRequestId, {})
  })

  test('should return empty array when no payment requests with schedules', async () => {
    const paymentRequests = [
      { paymentRequestNumber: 2, correlationId: '123' }
    ]

    getCompletedPaymentRequestByCorrelationId.mockRejectedValue(new Error('Error fetching completed payment request'))
    getCompletedSchedule.mockRejectedValue(new Error('Error fetching completed schedule'))

    const result = await getPreviousPaymentRequestsWithPaymentSchedules(paymentRequests, {})

    expect(result).toEqual([])
    expect(getCompletedPaymentRequestByCorrelationId).toHaveBeenCalledWith(paymentRequests[0].correlationId, {})
    expect(getCompletedSchedule).not.toHaveBeenCalled()
  })
})
