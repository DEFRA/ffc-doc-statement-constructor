const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

jest.mock('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')
const getCompletedPaymentRequestByPaymentRequestId = require('../../../../app/processing/payment-request/get-completed-payment-request-by-payment-request-id')

jest.mock('../../../../app/processing/payment-request/get-in-progress-payment-request')
const getInProgressPaymentRequest = require('../../../../app/processing/payment-request/get-in-progress-payment-request')

jest.mock('../../../../app/processing/payment-request/get-latest-completed-payment-request')
const getLatestCompletedPaymentRequest = require('../../../../app/processing/payment-request/get-latest-completed-payment-request')

jest.mock('../../../../app/processing/payment-request/validate-payment-request')
const validatePaymentRequest = require('../../../../app/processing/payment-request/validate-payment-request')

jest.mock('../../../../app/processing/payment-request/map-payment-request')
const mapPaymentRequest = require('../../../../app/processing/payment-request/map-payment-request')

const getLatestInProgressPaymentRequest = require('../../../../app/processing/payment-request/get-latest-in-progress-payment-request')

let retrievedPaymentRequest
let mappedPaymentRequest

let settlementDate

const { NAMES: SCHEDULE_NAMES } = require('../../../../app/constants/schedules')
const { DATE: SETTLEMENT_DATE } = require('../../../mock-components/mock-dates').SETTLEMENT

describe('get and map required payment request information for building a statement object', () => {
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
      originalValue: paymentRequest.value
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
      originalValue: retrievedPaymentRequest.originalValue
    }

    getCompletedPaymentRequestByPaymentRequestId.mockResolvedValue(retrievedPaymentRequest)
    getInProgressPaymentRequest.mockResolvedValue(retrievedPaymentRequest)
    getLatestCompletedPaymentRequest.mockResolvedValue(retrievedPaymentRequest)
    validatePaymentRequest.mockReturnValue(retrievedPaymentRequest)
    mapPaymentRequest.mockResolvedValue(mappedPaymentRequest)

    settlementDate = SETTLEMENT_DATE
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getCompletedPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(getCompletedPaymentRequestByPaymentRequestId).toHaveBeenCalled()
  })

  test('should call getCompletedPaymentRequest once when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(getCompletedPaymentRequestByPaymentRequestId).toHaveBeenCalledTimes(1)
  })

  test('should call getCompletedPaymentRequest with paymentRequestId when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(getCompletedPaymentRequestByPaymentRequestId).toHaveBeenCalledWith(paymentRequestId, mockTransaction)
  })

  test('should call getInProgressPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(getInProgressPaymentRequest).toHaveBeenCalled()
  })

  test('should call getInProgressPaymentRequest twice when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(getInProgressPaymentRequest).toHaveBeenCalledTimes(2)
  })

  test('should call getInProgressPaymentRequest with correlationId when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(getInProgressPaymentRequest).toHaveBeenCalledWith(retrievedPaymentRequest.correlationId, mockTransaction)
  })

  test('should call getLatestCompletedPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(getLatestCompletedPaymentRequest).toHaveBeenCalled()
  })

  test('should call getLatestCompletedPaymentRequest once when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(getLatestCompletedPaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call validatePaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(validatePaymentRequest).toHaveBeenCalled()
  })

  test('should call validatePaymentRequest once when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(validatePaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call validatePaymentRequest with retrievedPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(validatePaymentRequest).toHaveBeenCalledWith(retrievedPaymentRequest)
  })

  test('should call mapPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(mapPaymentRequest).toHaveBeenCalled()
  })

  test('should call mapPaymentRequest once when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(mapPaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call mapPaymentRequest with retrievedPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(mapPaymentRequest).toHaveBeenCalledWith(retrievedPaymentRequest)
  })

  test('should return mappedPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    const result = await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    expect(result).toStrictEqual(mappedPaymentRequest)
  })

  test('should throw when getCompletedPaymentRequest throws', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getCompletedPaymentRequest throws Error', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getCompletedPaymentRequest throws error with "Database retrieval issue"', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should not call validatePaymentRequest when getCompletedPaymentRequest throws', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction) } catch {}

    expect(validatePaymentRequest).not.toHaveBeenCalled()
  })

  test('should not call mapPaymentRequest when getCompletedPaymentRequest throws', async () => {
    const paymentRequestId = 1
    getCompletedPaymentRequestByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction) } catch {}

    expect(mapPaymentRequest).not.toHaveBeenCalled()
  })

  test('should throw when validatePaymentRequest throws', async () => {
    const paymentRequestId = 1
    validatePaymentRequest.mockImplementation(() => { throw new Error('Joi validation error') })

    const wrapper = async () => {
      await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when validatePaymentRequest throws Error', async () => {
    const paymentRequestId = 1
    validatePaymentRequest.mockImplementation(() => { throw new Error('Joi validation error') })

    const wrapper = async () => {
      await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Joi validation issue" when validatePaymentRequest throws with "Joi validation issue"', async () => {
    const paymentRequestId = 1
    validatePaymentRequest.mockImplementation(() => { throw new Error('Joi validation error') })

    const wrapper = async () => {
      await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    }

    expect(wrapper).rejects.toThrow(/^Joi validation error$/)
  })

  test('should not call mapPaymentRequest when validatePaymentRequest throws', async () => {
    const paymentRequestId = 1
    validatePaymentRequest.mockImplementation(() => { throw new Error('Joi validation error') })

    try { await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction) } catch {}

    expect(mapPaymentRequest).not.toHaveBeenCalled()
  })

  test('should throw when mapPaymentRequest throws', async () => {
    const paymentRequestId = 1
    mapPaymentRequest.mockRejectedValue(new Error('Payment request mapping issue'))

    const wrapper = async () => {
      await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when mapPaymentRequest throws Error', async () => {
    const paymentRequestId = 1
    mapPaymentRequest.mockRejectedValue(new Error('Payment request mapping issue'))

    const wrapper = async () => {
      await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Payment request mapping issue" when mapPaymentRequest throws error with "Payment request mapping issue"', async () => {
    const paymentRequestId = 1
    mapPaymentRequest.mockRejectedValue(new Error('Payment request mapping issue'))

    const wrapper = async () => {
      await getLatestInProgressPaymentRequest(paymentRequestId, settlementDate, mockTransaction)
    }

    expect(wrapper).rejects.toThrow(/^Payment request mapping issue$/)
  })
})
