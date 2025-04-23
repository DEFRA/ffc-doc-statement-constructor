const getD365ByPaymentReference = require('../../../../app/inbound/d365/get-d365-by-payment-reference')
const db = require('../../../../app/data')

jest.mock('../../../../app/data', () => ({
  d365: {
    count: jest.fn()
  }
}))

describe('getD365ByPaymentReference', () => {
  const mockTransaction = { id: 'mock-tx' }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('returns paymentReference if count > 0', async () => {
    db.d365.count.mockResolvedValue(1)

    const result = await getD365ByPaymentReference('REF123', mockTransaction)

    expect(db.d365.count).toHaveBeenCalledWith({
      transaction: mockTransaction,
      where: { paymentReference: 'REF123' },
      limit: 1
    })
    expect(result).toEqual({ paymentReference: 'REF123' })
  })

  test('returns null if count is 0', async () => {
    db.d365.count.mockResolvedValue(0)

    const result = await getD365ByPaymentReference('REF456', mockTransaction)

    expect(db.d365.count).toHaveBeenCalledWith({
      transaction: mockTransaction,
      where: { paymentReference: 'REF456' },
      limit: 1
    })
    expect(result).toBeNull()
  })
})
