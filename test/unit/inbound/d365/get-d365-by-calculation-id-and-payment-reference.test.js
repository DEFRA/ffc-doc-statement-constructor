const db = require('../../../../app/data')
const getd365ByCalculationIdAndPaymentReference = require('../../../../app/inbound/d365/get-d365-by-calculation-id-and-payment-reference')

jest.mock('../../../../app/data', () => ({
  d365: {
    findOne: jest.fn()
  }
}))

describe('getd365ByCalculationIdAndPaymentReference', () => {
  const d365 = { calculationReference: 123, paymentReference: 'PY12345' }
  const transaction = { id: 'txn1' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.d365.findOne with correct arguments', async () => {
    db.d365.findOne.mockResolvedValue({})
    await getd365ByCalculationIdAndPaymentReference(d365, transaction)
    expect(db.d365.findOne).toHaveBeenCalledWith({
      transaction,
      lock: true,
      where: { calculationId: 123, paymentReference: 'PY12345' }
    })
  })

  test('returns the result from db.d365.findOne', async () => {
    const expected = { id: 1, calculationId: 123, paymentReference: 'PY12345' }
    db.d365.findOne.mockResolvedValue(expected)
    const result = await getd365ByCalculationIdAndPaymentReference(d365, transaction)
    expect(result).toBe(expected)
  })

  test('returns null if db.d365.findOne returns null', async () => {
    db.d365.findOne.mockResolvedValue(null)
    const result = await getd365ByCalculationIdAndPaymentReference(d365, transaction)
    expect(result).toBeNull()
  })
})
