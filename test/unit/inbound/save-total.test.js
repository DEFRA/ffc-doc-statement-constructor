const db = require('../../../app/data')
const saveTotal = require('../../../app/inbound/total/save-total')
const mockTotal = require('../../mock-objects/mock-total')

jest.mock('../../../app/data', () => ({
  total: {
    upsert: jest.fn()
  }
}))

describe('saveTotal', () => {
  const mockTransaction = { id: 'mockTransaction' }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should save a total and return the saved total', async () => {
    const savedTotal = { id: 'savedTotal' }
    db.total.upsert.mockResolvedValue(savedTotal)
    const result = await saveTotal(mockTotal, mockTransaction)
    expect(db.total.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        calculationId: 123456789
      }),
      { transaction: mockTransaction }
    )
    expect(result).toEqual(savedTotal)
  })

  test('should throw an error if saving the total fails', async () => {
    const errorMessage = 'Error saving total: db.total.upsert is not a function'
    const error = new Error(errorMessage)
    db.total.upsert.mockRejectedValue(error)
    await expect(saveTotal(mockTotal, mockTransaction)).rejects.toThrow(errorMessage)
  })
})
