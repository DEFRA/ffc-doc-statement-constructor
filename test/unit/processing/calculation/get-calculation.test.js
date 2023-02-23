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

jest.mock('../../../../app/processing/calculation/schema')
const schema = require('../../../../app/processing/calculation/schema')

jest.mock('../../../../app/processing/calculation/get-calculation-by-payment-request-id')
const getCalculationByPaymentRequestId = require('../../../../app/processing/calculation/get-calculation-by-payment-request-id')

const getCalculation = require('../../../../app/processing/calculation/get-calculation')

let paymentRequestId
let invoiceNumber
let retrievedCalculation

describe('get and transform payment request information for building a statement object', () => {
  beforeEach(() => {
    const calculation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation')))
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))

    paymentRequestId = paymentRequest.paymentRequestId
    invoiceNumber = paymentRequest.invoiceNumber

    retrievedCalculation = {
      calculationId: 1,
      paymentRequestId: 1,
      calculationDate: calculation.calculationDate,
      invoiceNumber: calculation.invoiceNumber,
      sbi: calculation.sbi
    }

    schema.validate.mockReturnValue({ value: retrievedCalculation })
    getCalculationByPaymentRequestId.mockResolvedValue(retrievedCalculation)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getCalculationByPaymentRequestId when a paymentRequest is given', async () => {
    await getCalculation(paymentRequestId, invoiceNumber, mockTransaction)
    expect(getCalculationByPaymentRequestId).toHaveBeenCalled()
  })

  test('should call getCalculationByPaymentRequestId once when a paymentRequestId is given', async () => {
    await getCalculation(paymentRequestId, invoiceNumber)
    expect(getCalculationByPaymentRequestId).toHaveBeenCalledTimes(1)
  })

  test('should call getCalculationByPaymentRequestId with paymentRequestId when a paymentRequest is given', async () => {
    await getCalculation(paymentRequestId, invoiceNumber, mockTransaction)
    expect(getCalculationByPaymentRequestId).toHaveBeenCalledWith(paymentRequestId, mockTransaction)
  })

  test('should call schema.validate when a paymentRequest is given', async () => {
    await getCalculation(paymentRequestId, invoiceNumber)
    expect(schema.validate).toHaveBeenCalled()
  })

  test('should call schema.validate once when a paymentRequest is given', async () => {
    await getCalculation(paymentRequestId, invoiceNumber)
    expect(schema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call schema.validate with retrievedCalculation and { abortEarly: false } when a paymentRequest is given', async () => {
    await getCalculation(paymentRequestId, invoiceNumber)
    expect(schema.validate).toHaveBeenCalledWith(retrievedCalculation, { abortEarly: false })
  })

  test('should throw when getCalculationByPaymentRequestId throws', async () => {
    getCalculationByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getCalculation(paymentRequestId, invoiceNumber)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getCalculationByPaymentRequestId throws Error', async () => {
    getCalculationByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getCalculation(paymentRequestId, invoiceNumber)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getCalculationByPaymentRequestId throws error with "Database retrieval issue"', async () => {
    getCalculationByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getCalculation(paymentRequestId, invoiceNumber)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should not call schema.validate when getCalculationByPaymentRequestId throws', async () => {
    getCalculationByPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getCalculation(paymentRequestId, invoiceNumber) } catch {}

    expect(schema.validate).not.toHaveBeenCalled()
  })

  test('should throw when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getCalculation(paymentRequestId, invoiceNumber)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getCalculation(paymentRequestId, invoiceNumber)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which starts "Payment request with paymentRequestId:" when schema.validate returns with error key of "Joi validation issue"', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getCalculation(paymentRequestId, invoiceNumber)
    }

    expect(wrapper).rejects.toThrow(/^Payment request with paymentRequestId:/)
  })
})
