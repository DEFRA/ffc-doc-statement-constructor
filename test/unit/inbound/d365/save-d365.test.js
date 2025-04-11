const saveD365 = require('../../../../app/inbound/d365/save-d365') // Update the path to match your project
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

  test('throws an error if paymentAmount is missing', async () => {
    const badInput = {
      transactionDate: '2024-01-01',
      paymentReference: 'ABC123'
    }

    await expect(saveD365(badInput, mockTransaction)).rejects.toThrow(
      'D365 record missing required fields'
    )
  })

  test('throws an error if transactionDate is missing', async () => {
    const badInput = {
      paymentAmount: 100,
      paymentReference: 'DEF456'
    }

    await expect(saveD365(badInput, mockTransaction)).rejects.toThrow(
      'D365 record missing required fields'
    )
  })

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
