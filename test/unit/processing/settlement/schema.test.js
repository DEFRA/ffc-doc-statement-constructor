const schema = require('../../../../app/processing/settlement/schema')
let settlement

describe('settlement schema', () => {
  beforeEach(() => {
    settlement = {
      paymentRequestId: 1,
      invoiceNumber: 'S12345671234567V001',
      reference: 'PY1234567',
      settled: true,
      settlementDate: new Date(2022, 9, 12),
      value: 50000,
      paymentValue: 50000,
      lastSettlementValue: 0
    }
  })

  test('should not error if valid', () => {
    const result = schema.validate(settlement)
    expect(result.error).toBeUndefined()
  })

  test('should error if paymentRequestId null', () => {
    settlement.paymentRequestId = null
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if paymentRequestId undefined', () => {
    settlement.paymentRequestId = undefined
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if invoiceNumber null', () => {
    settlement.invoiceNumber = null
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if invoiceNumber undefined', () => {
    settlement.invoiceNumber = undefined
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if invoiceNumber not a string', () => {
    settlement.invoiceNumber = 1
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if reference null', () => {
    settlement.reference = null
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if reference undefined', () => {
    settlement.reference = undefined
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if reference not a string', () => {
    settlement.reference = 1
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if settled null', () => {
    settlement.settled = null
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if settled undefined', () => {
    settlement.settled = undefined
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if settlementDate null', () => {
    settlement.settlementDate = null
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if settlementDate undefined', () => {
    settlement.settlementDate = undefined
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if value null', () => {
    settlement.value = null
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if value undefined', () => {
    settlement.value = undefined
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })

  test('should error if value not an integer', () => {
    settlement.value = 50000.5
    const result = schema.validate(settlement)
    expect(result.error).toBeDefined()
  })
})
