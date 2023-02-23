const validateSettlement = require('../../../../app/processing/settlement/validate-settlement')

let retrievedSettlement

describe('validate settlement', () => {
  beforeEach(() => {
    const settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    retrievedSettlement = {
      invoiceNumber: settlement.invoiceNumber,
      paymentRequestId: 1,
      reference: settlement.reference,
      settled: settlement.settled,
      settlementDate: new Date(settlement.settlementDate),
      value: settlement.value,
      paymentValue: settlement.paymentValue,
      lastSettlementValue: settlement.lastSettlementValue
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedSettlement', async () => {
    const result = validateSettlement(retrievedSettlement)
    expect(result).toStrictEqual(retrievedSettlement)
  })

  test('should throw when retrievedSettlement is missing required paymentRequestId', async () => {
    delete retrievedSettlement.paymentRequestId
    expect(() => validateSettlement(retrievedSettlement)).toThrow()
  })

  test('should throw Error when retrievedSettlement is missing required paymentRequestId', async () => {
    delete retrievedSettlement.paymentRequestId
    expect(() => validateSettlement(retrievedSettlement)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "paymentRequestId" is required" when retrievedSettlement is missing required paymentRequestId', async () => {
    delete retrievedSettlement.paymentRequestId
    expect(() => validateSettlement(retrievedSettlement)).toThrow(/does not have the required data: "paymentRequestId" is required/)
  })

  test('should throw when retrievedSettlement is missing required reference', async () => {
    delete retrievedSettlement.reference
    expect(() => validateSettlement(retrievedSettlement)).toThrow()
  })

  test('should throw Error when retrievedSettlement is missing required reference', async () => {
    delete retrievedSettlement.reference
    expect(() => validateSettlement(retrievedSettlement)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "reference" is required" when retrievedSettlement is missing required reference', async () => {
    delete retrievedSettlement.reference
    expect(() => validateSettlement(retrievedSettlement)).toThrow(/does not have the required data: "reference" is required/)
  })

  test('should throw when retrievedSettlement is missing required settled', async () => {
    delete retrievedSettlement.settled
    expect(() => validateSettlement(retrievedSettlement)).toThrow()
  })

  test('should throw Error when retrievedSettlement is missing required settled', async () => {
    delete retrievedSettlement.settled
    expect(() => validateSettlement(retrievedSettlement)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "settled" is required" when retrievedSettlement is missing required settled', async () => {
    delete retrievedSettlement.settled
    expect(() => validateSettlement(retrievedSettlement)).toThrow(/does not have the required data: "settled" is required/)
  })

  test('should throw when retrievedSettlement is missing required settlementDate', async () => {
    delete retrievedSettlement.settlementDate
    expect(() => validateSettlement(retrievedSettlement)).toThrow()
  })

  test('should throw Error when retrievedSettlement is missing required settlementDate', async () => {
    delete retrievedSettlement.settlementDate
    expect(() => validateSettlement(retrievedSettlement)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "settlementDate" is required" when retrievedSettlement is missing required settlementDate', async () => {
    delete retrievedSettlement.settlementDate
    expect(() => validateSettlement(retrievedSettlement)).toThrow(/does not have the required data: "settlementDate" is required/)
  })

  test('should throw when retrievedSettlement is missing required value', async () => {
    delete retrievedSettlement.value
    expect(() => validateSettlement(retrievedSettlement)).toThrow()
  })

  test('should throw Error when retrievedSettlement is missing required value', async () => {
    delete retrievedSettlement.value
    expect(() => validateSettlement(retrievedSettlement)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "value" is required" when retrievedSettlement is missing required value', async () => {
    delete retrievedSettlement.value
    expect(() => validateSettlement(retrievedSettlement)).toThrow(/does not have the required data: "value" is required/)
  })

  test('should throw when retrievedSettlement is missing required paymentValue', async () => {
    delete retrievedSettlement.paymentValue
    expect(() => validateSettlement(retrievedSettlement)).toThrow()
  })

  test('should throw Error when retrievedSettlement is missing required paymentValue', async () => {
    delete retrievedSettlement.paymentValue
    expect(() => validateSettlement(retrievedSettlement)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "paymentValue" is required" when retrievedSettlement is missing required paymentValue', async () => {
    delete retrievedSettlement.paymentValue
    expect(() => validateSettlement(retrievedSettlement)).toThrow(/does not have the required data: "paymentValue" is required/)
  })

  test('should throw when retrievedSettlement is missing required lastSettlementValue', async () => {
    delete retrievedSettlement.lastSettlementValue
    expect(() => validateSettlement(retrievedSettlement)).toThrow()
  })

  test('should throw Error when retrievedSettlement is missing required lastSettlementValue', async () => {
    delete retrievedSettlement.lastSettlementValue
    expect(() => validateSettlement(retrievedSettlement)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "lastSettlementValue" is required" when retrievedSettlement is missing required lastSettlementValue', async () => {
    delete retrievedSettlement.lastSettlementValue
    expect(() => validateSettlement(retrievedSettlement)).toThrow(/does not have the required data: "lastSettlementValue" is required/)
  })
})
