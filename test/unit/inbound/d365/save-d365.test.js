const saveD365 = require('../../../../app/inbound/d365/save-d365') // Update path if needed
const db = require('../../../../app/data')

jest.mock('../../../../app/data', () => ({
  d365: {
    create: jest.fn()
  }
}))

describe('saveD365', () => {
  const mockTransaction = { id: 'mock-transaction' }

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Test missing required fields using test.each to reduce repetition
  test.each([
    [{ transactionDate: '2024-01-01', paymentReference: 'ABC123' }, 'paymentAmount'],
    [{ paymentAmount: 100, paymentReference: 'DEF456' }, 'transactionDate']
  ])(
    'throws an error if %s is missing',
    async (badInput, missingField) => {
      await expect(saveD365(badInput, mockTransaction)).rejects.toThrow(
        'D365 record missing required fields'
      )
    }
  )

  test('calls db.d365.create with correct arguments if required fields are present', async () => {
    const goodInput = {
      paymentAmount: 100,
      transactionDate: '2024-01-01',
      paymentReference: 'GHI789'
    }

    db.d365.create.mockResolvedValue('mock-result')

    const result = await saveD365(goodInput, mockTransaction)

    expect(db.d365.create).toHaveBeenCalledWith(goodInput, {
      transaction: mockTransaction,
      raw: true
    })
    expect(result).toBe('mock-result')
  })
})
