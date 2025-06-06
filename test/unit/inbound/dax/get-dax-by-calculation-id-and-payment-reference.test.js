const db = require('../../../../app/data')
const getDaxByCalculationIdAndPaymentReference = require('../../../../app/inbound/dax/get-dax-by-calculation-id-and-payment-reference')

jest.mock('../../../../app/data', () => ({
  dax: {
    findOne: jest.fn()
  }
}))

describe('getDaxByCalculationIdAndPaymentReference', () => {
  const dax = { calculationReference: 123, paymentReference: 'PY12345' }
  const transaction = { id: 'txn1' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.dax.findOne with correct arguments', async () => {
    db.dax.findOne.mockResolvedValue({})
    await getDaxByCalculationIdAndPaymentReference(dax, transaction)
    expect(db.dax.findOne).toHaveBeenCalledWith({
      transaction,
      lock: true,
      where: { calculationId: 123, paymentReference: 'PY12345' }
    })
  })

  test('returns the result from db.dax.findOne', async () => {
    const expected = { id: 1, calculationId: 123, paymentReference: 'PY12345' }
    db.dax.findOne.mockResolvedValue(expected)
    const result = await getDaxByCalculationIdAndPaymentReference(dax, transaction)
    expect(result).toBe(expected)
  })

  test('returns null if db.dax.findOne returns null', async () => {
    db.dax.findOne.mockResolvedValue(null)
    const result = await getDaxByCalculationIdAndPaymentReference(dax, transaction)
    expect(result).toBeNull()
  })
})
