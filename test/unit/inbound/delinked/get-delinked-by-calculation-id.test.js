const db = require('../../../../app/data')
const getDelinkedByCalculationId = require('../../../../app/inbound/delinked/get-delinked-by-calculation-id')

jest.mock('../../../../app/data')

describe('getDelinkedByCalculationId', () => {
  const mockTransaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return { calculationId } if count > 0', async () => {
    db.delinkedCalculation.count.mockResolvedValue(1)

    const result = await getDelinkedByCalculationId('abc123', mockTransaction)

    expect(db.delinkedCalculation.count).toHaveBeenCalledWith({
      transaction: mockTransaction,
      where: { calculationId: 'abc123' },
      limit: 1
    })
    expect(result).toEqual({ calculationId: 'abc123' })
  })

  test('should return null if count is 0', async () => {
    db.delinkedCalculation.count.mockResolvedValue(0)

    const result = await getDelinkedByCalculationId('abc123', mockTransaction)

    expect(db.delinkedCalculation.count).toHaveBeenCalledWith({
      transaction: mockTransaction,
      where: { calculationId: 'abc123' },
      limit: 1
    })
    expect(result).toBeNull()
  })

  test('should throw if db.delinkedCalculation.count throws', async () => {
    db.delinkedCalculation.count.mockRejectedValue(new Error('DB error'))

    await expect(getDelinkedByCalculationId('abc123', mockTransaction)).rejects.toThrow('DB error')
  })
})
