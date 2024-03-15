const db = require('../../../app/data')
const saveTotal = require('../../../app/inbound/total/save-total')
const mockTotal = require('../../mock-objects/mock-total')

jest.mock('../../../app/data', () => ({
  total: {
    create: jest.fn()
  }
}))

describe('saveTotal', () => {
  const mockTransaction = { id: 'mockTransaction' }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should save a total and return the saved total', async () => {
    const savedTotal = { id: 'savedTotal' }
    db.total.create.mockResolvedValue(savedTotal)
    const result = await saveTotal(mockTotal, mockTransaction)
    expect(db.total.create).toHaveBeenCalledWith(
      expect.objectContaining({
        calculationId: 123456789
      }),
      { transaction: mockTransaction }
    )
    expect(result).toEqual(savedTotal)
  })

  test('should throw an error if saving the total fails', async () => {
    const error = new Error('save error')
    db.total.create.mockRejectedValue(error)

    await expect(saveTotal(mockTotal, mockTransaction)).rejects.toThrow(`Error saving total: ${error.message}`)
  })
})
