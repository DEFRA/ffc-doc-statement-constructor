jest.mock('../../../../app/processing/funding')
const mockFunding = require('../../../../app/processing/funding')

jest.mock('../../../../app/processing/invoice-line')
const mockInvoiceLine = require('../../../../app/processing/invoice-line')

const getDetailedFunding = require('../../../../app/processing/components/get-detailed-funding')

let fundings
let mappedFundings
let invoiceLine

describe('get detailed funding', () => {
  beforeEach(() => {
    fundings = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-fundings')))

    mappedFundings = [
      {
        area: fundings[0].areaClaimed,
        level: '',
        name: 'Moorland',
        rate: fundings[0].rate
      },
      {
        area: fundings[1].areaClaimed,
        level: 'Introductory',
        name: 'Arable and horticultural soils',
        rate: fundings[1].rate
      }
    ]

    invoiceLine = {
      annualValue: 10000,
      quarterlyValue: 2500,
      quarterlyReduction: 0,
      quarterlyPayment: 2500,
      reductions: []
    }

    mockFunding.mockImplementation(() => [mappedFundings[0]])
    mockInvoiceLine.mockImplementation(() => invoiceLine)
  })

  test('returns detailed fundings for one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.length).toBe(2)
  })

  test('returns funding row for one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === mappedFundings[0].name)).toBeDefined()
  })

  test('returns total row for one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total')).toBeDefined()
  })

  test('returns correct funding row area', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === mappedFundings[0].name).area).toBe(mappedFundings[0].area)
  })

  test('returns correct funding row level', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === mappedFundings[0].name).level).toBe(mappedFundings[0].level)
  })

  test('returns correct funding row name', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === mappedFundings[0].name).name).toBe(mappedFundings[0].name)
  })

  test('returns correct funding row rate', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === mappedFundings[0].name).rate).toBe(mappedFundings[0].rate)
  })

  test('returns correct funding row annualValue', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === mappedFundings[0].name).annualValue).toBe('100.00')
  })

  test('returns correct funding row quarterlyValue', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === mappedFundings[0].name).quarterlyValue).toBe('25.00')
  })

  test('returns correct funding row quarterlyReduction', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === mappedFundings[0].name).quarterlyReduction).toBe('0.00')
  })

  test('returns correct funding row quarterlyPayment', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === mappedFundings[0].name).quarterlyPayment).toBe('25.00')
  })

  test('returns correct total row annualValue when one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').annualValue).toBe('100.00')
  })

  test('returns correct total row quarterlyValue when one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyValue).toBe('25.00')
  })

  test('returns correct total row quarterlyReduction when one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyReduction).toBe('0.00')
  })

  test('returns correct total row quarterlyPayment when one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyPayment).toBe('25.00')
  })

  test('returns correct total row annualValue when multiple funding options', async () => {
    mockFunding.mockImplementation(() => mappedFundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').annualValue).toBe('200.00')
  })

  test('returns correct total row quarterlyValue when multiple funding options', async () => {
    mockFunding.mockImplementation(() => mappedFundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyValue).toBe('50.00')
  })

  test('returns correct total row quarterlyReduction when multiple funding options', async () => {
    mockFunding.mockImplementation(() => mappedFundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyReduction).toBe('0.00')
  })

  test('returns correct total row quarterlyPayment when multiple funding options', async () => {
    mockFunding.mockImplementation(() => mappedFundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyPayment).toBe('50.00')
  })

  test('returns correct total row annualValue when multiple funding options and reductions', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => mappedFundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').annualValue).toBe('200.00')
  })

  test('returns correct total row quarterlyValue when multiple funding options and reductions', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => mappedFundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyValue).toBe('50.00')
  })

  test('returns correct total row quarterlyReduction when multiple funding options and reductions', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => mappedFundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyReduction).toBe('20.00')
  })

  test('returns correct total row quarterlyPayment when multiple funding options and reductions', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => mappedFundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyPayment).toBe('30.00')
  })

  test('returns correct total row annualValue when multiple funding options and reductions and invoice lines', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => mappedFundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').annualValue).toBe('200.00')
  })

  test('returns correct total row quarterlyValue when multiple funding options and reductions and invoice lines', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => mappedFundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyValue).toBe('50.00')
  })
})
