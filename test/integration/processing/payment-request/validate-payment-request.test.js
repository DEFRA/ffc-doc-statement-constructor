const { DAX_CODES } = require('../../../../app/constants/schedules')

const validatePaymentRequest = require('../../../../app/processing/payment-request/validate-payment-request')

let retrievedPaymentRequest

describe('validate payment request', () => {
  beforeEach(() => {
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    retrievedPaymentRequest = {
      agreementNumber: paymentRequest.agreementNumber,
      correlationId: paymentRequest.correlationId,
      dueDate: new Date(paymentRequest.dueDate),
      invoiceNumber: paymentRequest.invoiceNumber,
      marketingYear: paymentRequest.marketingYear,
      paymentRequestId: paymentRequest.paymentRequestId,
      paymentRequestNumber: paymentRequest.paymentRequestNumber,
      value: paymentRequest.value,
      schedule: paymentRequest.schedule,
      originalValue: paymentRequest.value
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedPaymentRequest', () => {
    const result = validatePaymentRequest(retrievedPaymentRequest)
    expect(result).toStrictEqual(retrievedPaymentRequest)
  })

  test('should throw when retrievedPaymentRequest is missing required paymentRequestId', () => {
    delete retrievedPaymentRequest.paymentRequestId
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow()
  })

  test('should throw Error when retrievedPaymentRequest is missing required paymentRequestId', () => {
    delete retrievedPaymentRequest.paymentRequestId
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "paymentRequestId" is required" when retrievedPaymentRequest is missing required paymentRequestId', () => {
    delete retrievedPaymentRequest.paymentRequestId
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(/does not have the required data: "paymentRequestId" is required/)
  })

  test('should throw when retrievedPaymentRequest is missing required dueDate', () => {
    delete retrievedPaymentRequest.dueDate
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow()
  })

  test('should throw Error when retrievedPaymentRequest is missing required dueDate', () => {
    delete retrievedPaymentRequest.dueDate
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "dueDate" is required" when retrievedPaymentRequest is missing required dueDate', () => {
    delete retrievedPaymentRequest.dueDate
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(/does not have the required data: "dueDate" is required/)
  })

  test('should throw when retrievedPaymentRequest is missing required marketingYear', () => {
    delete retrievedPaymentRequest.marketingYear
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow()
  })

  test('should throw Error when retrievedPaymentRequest is missing required marketingYear', () => {
    delete retrievedPaymentRequest.marketingYear
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "marketingYear" is required" when retrievedPaymentRequest is missing required marketingYear', () => {
    delete retrievedPaymentRequest.marketingYear
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(/does not have the required data: "marketingYear" is required/)
  })

  test('should throw Error when retrievedPaymentRequest is missing required correlationId', () => {
    delete retrievedPaymentRequest.correlationId
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "correlationId" is required" when retrievedPaymentRequest is missing required correlationId', () => {
    delete retrievedPaymentRequest.correlationId
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).toThrow(/does not have the required data: "correlationId" is required/)
  })

  test('should not throw when retrievedPaymentRequest is missing required originalValue', () => {
    delete retrievedPaymentRequest.originalValue
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).not.toThrow()
  })

  test('should not throw Error when retrievedPaymentRequest is missing required originalValue', () => {
    delete retrievedPaymentRequest.originalValue
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).not.toThrow(Error)
  })

  test('should not throw error which ends "does not have the required data: "originalValue" is required" when retrievedPaymentRequest is missing required originalValue', () => {
    delete retrievedPaymentRequest.originalValue
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).not.toThrow(/does not have the required data: "originalValue" is required/)
  })

  test('should not throw when retrievedPaymentRequest is missing optional schedule', () => {
    delete retrievedPaymentRequest.schedule
    expect(() => validatePaymentRequest(retrievedPaymentRequest)).not.toThrow()
  })

  test('should return retrievedPaymentRequest with default DAX_CODES.QUARTERLY schedule when retrievedPaymentRequest is missing optional schedule', () => {
    delete retrievedPaymentRequest.schedule

    const result = validatePaymentRequest(retrievedPaymentRequest)

    const defaultSchedulePaymentRequest = { ...retrievedPaymentRequest, schedule: DAX_CODES.QUARTERLY }
    expect(result).toStrictEqual(defaultSchedulePaymentRequest)
  })
})
