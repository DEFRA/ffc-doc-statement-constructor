const db = require('../../../../app/data')
const getDaxByCalculationId = require('../../../../app/inbound/dax/get-dax-by-calculation-id')

jest.mock('../../../../app/data', () => ({
  dax: {
    findOne: jest.fn()
  }
}))

describe('getDaxByCalculationId', () => {
  const calculationId = 123
  const transaction = { id: 'txn1' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.dax.findOne with correct arguments', async () => {
    db.dax.findOne.mockResolvedValue({})
    await getDaxByCalculationId(calculationId, transaction)
    expect(db.dax.findOne).toHaveBeenCalledWith({
      transaction,
      lock: true,
      where: { calculationId }
    })
  })

  test('returns the result from db.dax.findOne', async () => {
    const expected = { id: 1, calculationId }
    db.dax.findOne.mockResolvedValue(expected)
    const result = await getDaxByCalculationId(calculationId, transaction)
    expect(result).toBe(expected)
  })

  test('returns null if db.dax.findOne returns null', async () => {
    db.dax.findOne.mockResolvedValue(null)
    const result = await getDaxByCalculationId(calculationId, transaction)
    expect(result).toBeNull()
  })
})
