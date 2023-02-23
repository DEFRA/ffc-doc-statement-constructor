const getLatestPayment = require('../../../../app/processing/payment/get-latest-payment')
const { DATE } = require('../../../mock-components/mock-dates').DUE
let paymentRequest
let settlement
let supportingSettlements
let instalmentValue

describe('get latest payment', () => {
  beforeEach(() => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    paymentRequest.dueDate = DATE
    paymentRequest.originalValue = paymentRequest.value
    settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    supportingSettlements = []
    instalmentValue = Math.trunc(paymentRequest.value / 4)
  })

  test('returns invoice number from payment request', () => {
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.invoiceNumber).toBe(paymentRequest.invoiceNumber)
  })

  test('returns due date from payment request', () => {
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.dueDate).toBe(paymentRequest.dueDate)
  })

  test('returns paymentValue from settlement if no supporting settlements', () => {
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.value).toBe(settlement.paymentValue)
  })

  test('returns paymentValue from settlement if supporting settlements null', () => {
    supportingSettlements = null
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.value).toBe(settlement.paymentValue)
  })

  test('returns returns paymentValue from settlement if supporting settlements undefined', () => {
    supportingSettlements = undefined
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.value).toBe(settlement.paymentValue)
  })

  test('returns value including supporting settlement top up', () => {
    supportingSettlements = [{ paymentValue: 10000 }]
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.value).toBe(60000)
  })

  test('returns value including supporting settlement downward adjustment', () => {
    supportingSettlements = [{ paymentValue: -10000 }]
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.value).toBe(40000)
  })

  test('returns value including top up and downward adjustment', () => {
    supportingSettlements = [{ paymentValue: 10000 }, { paymentValue: -5000 }]
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.value).toBe(55000)
  })

  test('returns value including multiple supporting settlements', () => {
    supportingSettlements = [{ paymentValue: 10000 }, { paymentValue: -5000 }, { paymentValue: 20000 }]
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.value).toBe(75000)
  })

  test('returns period if one instalment settled', () => {
    settlement.paymentValue = instalmentValue
    settlement.lastSettlementValue = 0
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('September to November 2022')
  })

  test('returns period if first instalment settled and next instalment settled', () => {
    settlement.paymentValue = instalmentValue
    settlement.lastSettlementValue = instalmentValue
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('December to February 2023')
  })

  test('returns period if first two instalments settled and next instalment settled', () => {
    settlement.paymentValue = instalmentValue
    settlement.lastSettlementValue = instalmentValue * 2
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('March to May 2023')
  })

  test('returns period if first three instalments settled and next instalment settled', () => {
    settlement.paymentValue = instalmentValue
    settlement.lastSettlementValue = instalmentValue * 3
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('June to August 2023')
  })

  test('returns period if last settlement value 0 and two instalment settled', () => {
    settlement.paymentValue = instalmentValue * 2
    settlement.lastSettlementValue = 0
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('September to February 2023')
  })

  test('returns period if first instalment settled and next two instalments settled', () => {
    settlement.paymentValue = instalmentValue * 2
    settlement.lastSettlementValue = instalmentValue
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('December to May 2023')
  })

  test('returns period if first two settled and next two instalments settled', () => {
    settlement.paymentValue = instalmentValue * 2
    settlement.lastSettlementValue = instalmentValue * 2
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('March to August 2023')
  })

  test('returns period if last settlement value 0 and three instalments settled', () => {
    settlement.paymentValue = instalmentValue * 3
    settlement.lastSettlementValue = 0
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('September to May 2023')
  })

  test('returns period if first instalment settled and next three instalments settled', () => {
    settlement.paymentValue = instalmentValue * 3
    settlement.lastSettlementValue = instalmentValue
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('December to August 2023')
  })

  test('returns period if last settlement value 0 and four instalments settled', () => {
    settlement.paymentValue = instalmentValue * 4
    settlement.lastSettlementValue = 0
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('September to August 2023')
  })

  test('returns period as dueDate month if schedule null', () => {
    paymentRequest.schedule = null
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('December 2022')
  })

  test('returns period as dueDate month if schedule undefined', () => {
    paymentRequest.schedule = undefined
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('December 2022')
  })

  test('returns period as dueDate month if schedule false', () => {
    paymentRequest.schedule = false
    const result = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    expect(result.period).toBe('December 2022')
  })
})
