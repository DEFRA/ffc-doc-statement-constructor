const db = require('../../../../app/data')
const getExistingD365 = require('../../../../app/inbound/d365/get-existing-d365')

jest.mock('../../../../app/data', () => ({
  d365: {
    findOne: jest.fn()
  }
}))

describe('getExistingD365', () => {
  const d365 = { paymentReference: 'PY12345', paymentPeriod: 'Q4-2025', paymentAmount: '100.00', transactionDate: '2026-01-01' }
  const transaction = { id: 'txn1' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.d365.findOne with correct arguments', async () => {
    db.d365.findOne.mockResolvedValue({})
    await getExistingD365(d365, transaction)
    expect(db.d365.findOne).toHaveBeenCalledWith({
      transaction,
      lock: true,
      where: { paymentReference: 'PY12345', paymentPeriod: 'Q4-2025', paymentAmount: '100.00', transactionDate: '2026-01-01' }
    })
  })

  test('returns the result from db.d365.findOne', async () => {
    const expected = { id: 1, calculationId: 123, paymentReference: 'PY12345' }
    db.d365.findOne.mockResolvedValue(expected)
    const result = await getExistingD365(d365, transaction)
    expect(result).toBe(expected)
  })

  test('returns null if db.d365.findOne returns null', async () => {
    db.d365.findOne.mockResolvedValue(null)
    const result = await getExistingD365(d365, transaction)
    expect(result).toBeNull()
  })
})
