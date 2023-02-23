jest.mock('../../../../app/processing/invoice-line/schema')
const schema = require('../../../../app/processing/invoice-line/schema')

jest.mock('../../../../app/processing/invoice-line/get-positive-invoice-line-by-funding-code-and-payment-request-id')
const getPositiveInvoiceLineByFundingCodeAndPaymentRequestId = require('../../../../app/processing/invoice-line/get-positive-invoice-line-by-funding-code-and-payment-request-id')

jest.mock('../../../../app/processing/invoice-line/get-reductions')
const getReductions = require('../../../../app/processing/invoice-line/get-reductions')

const getInvoiceLine = require('../../../../app/processing/invoice-line/get-invoice-line')

let invoiceLine
let fundingCode
let paymentRequestId

const QUARTER = 0.25

describe('get and transform invoice-line object for building a statement object', () => {
  beforeEach(() => {
    invoiceLine = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-invoice-line')))[0]
    fundingCode = invoiceLine.fundingCode
    paymentRequestId = 1

    schema.validate.mockReturnValue({ value: { value: invoiceLine.value, description: invoiceLine.description } })
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockResolvedValue(invoiceLine)
    getReductions.mockResolvedValue({ reductions: [], annualReduction: 0 })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getPositiveInvoiceLineByFundingCodeAndPaymentRequestId when a fundingCode and a paymentRequestId are given', async () => {
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(getPositiveInvoiceLineByFundingCodeAndPaymentRequestId).toHaveBeenCalled()
  })

  test('should call getPositiveInvoiceLineByFundingCodeAndPaymentRequestId once when a fundingCode and a paymentRequestId are given', async () => {
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(getPositiveInvoiceLineByFundingCodeAndPaymentRequestId).toHaveBeenCalledTimes(1)
  })

  test('should call getPositiveInvoiceLineByFundingCodeAndPaymentRequestId with fundingCode and paymentRequestId when a fundingCode and a paymentRequestId are given', async () => {
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(getPositiveInvoiceLineByFundingCodeAndPaymentRequestId).toHaveBeenCalledWith(fundingCode, paymentRequestId)
  })

  test('should call schema.validate when a fundingCode and a paymentRequestId are given', async () => {
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(schema.validate).toHaveBeenCalled()
  })

  test('should call schema.validate once when a fundingCode and a paymentRequestId are given', async () => {
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(schema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call schema.validate with rawCalculationData and { abortEarly: false } when a fundingCode and a paymentRequestId are given', async () => {
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(schema.validate).toHaveBeenCalledWith(invoiceLine, { abortEarly: false })
  })

  test('should call getReductions when a fundingCode and a paymentRequestId are given', async () => {
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(getReductions).toHaveBeenCalled()
  })

  test('should call getReductions once when a fundingCode and a paymentRequestId are given', async () => {
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(getReductions).toHaveBeenCalledTimes(1)
  })

  test('should call getReductions with fundingCode and paymentRequestId when a fundingCode and a paymentRequestId are given', async () => {
    await getInvoiceLine(fundingCode, paymentRequestId)
    expect(getReductions).toHaveBeenCalledWith(fundingCode, paymentRequestId)
  })

  test('should return when no reductions', async () => {
    const result = await getInvoiceLine(fundingCode, paymentRequestId)

    expect(result).toStrictEqual({
      annualValue: invoiceLine.value,
      quarterlyValue: invoiceLine.value * QUARTER,
      quarterlyReduction: 0,
      quarterlyPayment: invoiceLine.value * QUARTER,
      reductions: []
    })
  })

  test('should return altered values when getReductions returns with 1 reduction', async () => {
    getReductions.mockResolvedValue({ reductions: [{ reason: 'Over Declaration reduction', value: 200 }], annualReduction: 200 })

    const result = await getInvoiceLine(fundingCode, paymentRequestId)

    expect(result).toStrictEqual({
      annualValue: invoiceLine.value,
      quarterlyValue: invoiceLine.value * QUARTER,
      quarterlyReduction: (await getReductions()).annualReduction * QUARTER,
      quarterlyPayment: (invoiceLine.value * QUARTER) - ((await getReductions()).annualReduction * QUARTER),
      reductions: (await getReductions()).reductions
    })
  })

  test('should throw when getPositiveInvoiceLineByFundingCodeAndPaymentRequestId throws', async () => {
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    await expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getPositiveInvoiceLineByFundingCodeAndPaymentRequestId throws Error', async () => {
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    await expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getPositiveInvoiceLineByFundingCodeAndPaymentRequestId throws error with "Database retrieval issue"', async () => {
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    await expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should not call schema.validate when getPositiveInvoiceLineByFundingCodeAndPaymentRequestId throws', async () => {
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getInvoiceLine(fundingCode, paymentRequestId) } catch {}

    expect(schema.validate).not.toHaveBeenCalled()
  })

  test('should not call getReductions when getPositiveInvoiceLineByFundingCodeAndPaymentRequestId throws', async () => {
    getPositiveInvoiceLineByFundingCodeAndPaymentRequestId.mockRejectedValue(new Error('Database retrieval issue'))
    try { await getInvoiceLine(fundingCode, paymentRequestId) } catch {}
    expect(getReductions).not.toHaveBeenCalled()
  })

  test('should throw when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    await expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    await expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which starts "Payment request with paymentRequestId: 1 does not have the required invoice-line data for funding code 80101" when schema.validate returns with error key of "Joi validation issue"', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    await expect(wrapper).rejects.toThrow(/^Payment request with paymentRequestId: 1 does not have the required gross invoice-line data for funding code 80190/)
  })

  test('should not call getReductions when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    try { await getInvoiceLine(fundingCode, paymentRequestId) } catch {}
    expect(getReductions).not.toHaveBeenCalled()
  })

  test('should throw when getReductions throws', async () => {
    getReductions.mockRejectedValue(new Error('Cannot get reductions'))

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    await expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getReductions throws Error', async () => {
    getReductions.mockRejectedValue(new Error('Cannot get reductions'))

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    await expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Cannot get reductions" when getReductions throws error with "Cannot get reductions"', async () => {
    getReductions.mockRejectedValue(new Error('Cannot get reductions'))

    const wrapper = async () => {
      await getInvoiceLine(fundingCode, paymentRequestId)
    }

    await expect(wrapper).rejects.toThrow(/^Cannot get reductions$/)
  })
})
