jest.mock('../../../../app/processing/invoice-line/get-reductions')
const getReductions = require('../../../../app/processing/invoice-line/get-reductions')

const mapInvoiceLine = require('../../../../app/processing/invoice-line/map-invoice-line')
const REDUCTIONS = ''
const ANNUAL_REDUCTION = 500.00
const QUARTER = 0.25
const MIN_PAYMENT_VALUE = 0
let grossValueInvoiceLine
let mappedInvoiceLine

describe('map invoiceLine information for building a statement object', () => {
  beforeEach(() => {
    grossValueInvoiceLine = {
      value: 15.00
    }

    mappedInvoiceLine = {
      annualValue: grossValueInvoiceLine.value,
      quarterlyValue: grossValueInvoiceLine.value > MIN_PAYMENT_VALUE ? grossValueInvoiceLine.value * QUARTER : MIN_PAYMENT_VALUE,
      quarterlyReduction: ANNUAL_REDUCTION * QUARTER,
      quarterlyPayment: (grossValueInvoiceLine.value > MIN_PAYMENT_VALUE ? grossValueInvoiceLine.value * QUARTER : MIN_PAYMENT_VALUE) - (ANNUAL_REDUCTION * QUARTER),
      reductions: REDUCTIONS
    }

    getReductions.mockResolvedValue({ reductions: REDUCTIONS, annualReduction: ANNUAL_REDUCTION })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getReductions', async () => {
    await mapInvoiceLine(grossValueInvoiceLine)
    expect(getReductions).toHaveBeenCalled()
  })

  test('should return mappedInvoiceLine when a valid invoiceLine is given', async () => {
    const result = await mapInvoiceLine(grossValueInvoiceLine)
    expect(result).toStrictEqual(mappedInvoiceLine)
  })
})
