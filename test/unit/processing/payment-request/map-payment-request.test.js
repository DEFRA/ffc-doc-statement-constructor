const mapPaymentRequest = require('../../../../app/processing/payment-request/map-payment-request')

let retrievedPaymentRequest
let mappedPaymentRequest

const { NAMES: SCHEDULE_NAMES } = require('../../../../app/constants/schedules')

describe('map required payment request information for building a statement object', () => {
  beforeEach(() => {
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))

    retrievedPaymentRequest = {
      paymentRequestId: 1,
      agreementNumber: paymentRequest.agreementNumber,
      dueDate: paymentRequest.dueDate,
      invoiceNumber: paymentRequest.invoiceNumber,
      marketingYear: paymentRequest.marketingYear,
      value: paymentRequest.value,
      schedule: paymentRequest.schedule,
      sourceSystem: paymentRequest.sourceSystem,
      originalValue: paymentRequest.value,
      paymentRequestNumber: paymentRequest.paymentRequestNumber
    }

    mappedPaymentRequest = {
      paymentRequestId: retrievedPaymentRequest.paymentRequestId,
      agreementNumber: retrievedPaymentRequest.agreementNumber,
      dueDate: retrievedPaymentRequest.dueDate,
      frequency: SCHEDULE_NAMES[retrievedPaymentRequest.schedule],
      invoiceNumber: retrievedPaymentRequest.invoiceNumber,
      value: retrievedPaymentRequest.value,
      year: retrievedPaymentRequest.marketingYear,
      schedule: retrievedPaymentRequest.schedule,
      sourceSystem: retrievedPaymentRequest.sourceSystem,
      originalValue: retrievedPaymentRequest.originalValue,
      paymentRequestNumber: retrievedPaymentRequest.paymentRequestNumber
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return mappedPaymentRequest when a valid paymentRequest is given', () => {
    const result = mapPaymentRequest(retrievedPaymentRequest)
    expect(result).toStrictEqual(mappedPaymentRequest)
  })

  test('should return mappedPaymentRequest with default frequency when a paymentRequest with no schedule is given', () => {
    delete retrievedPaymentRequest.schedule
    const result = mapPaymentRequest(retrievedPaymentRequest)
    expect(result).toStrictEqual({ ...mappedPaymentRequest, schedule: undefined, frequency: SCHEDULE_NAMES.N0 })
  })

  test('should return mappedPaymentRequest with default frequency when a paymentRequest with an unrecognised schedule is given', () => {
    retrievedPaymentRequest.schedule = 'NR'
    const result = mapPaymentRequest(retrievedPaymentRequest)
    expect(result).toStrictEqual({ ...mappedPaymentRequest, schedule: 'NR', frequency: SCHEDULE_NAMES.N0 })
  })

  test('should return undefined object with default frequency when an empty object is given', () => {
    const undefinedMappedPaymentRequest = Object.keys(mappedPaymentRequest).reduce((o, k) => ({ ...o, [k]: undefined }), {})
    const result = mapPaymentRequest({})
    expect(result).toStrictEqual({ ...undefinedMappedPaymentRequest, frequency: SCHEDULE_NAMES.N0 })
  })
})
