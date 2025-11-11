const db = require('../../../../app/data')
const getDelinkedByCalculationId = require('../../../../app/inbound/delinked/get-delinked-by-calculation-id')

jest.mock('../../../../app/data')

describe('getDelinkedByCalculationId', () => {
  const mockTransaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test.each([
    [1, { calculationId: 'abc123' }],
    [0, null]
  ])('returns correct result when count is %i', async (count, expected) => {
    db.delinkedCalculation.count.mockResolvedValue(count)

    const result = await getDelinkedByCalculationId('abc123', mockTransaction)

    expect(db.delinkedCalculation.count).toHaveBeenCalledWith({
      transaction: mockTransaction,
      where: { calculationId: 'abc123' },
      limit: 1
    })
    expect(result).toEqual(expected)
  })

  test('throws if db.delinkedCalculation.count throws', async () => {
    db.delinkedCalculation.count.mockRejectedValue(new Error('DB error'))

    await expect(getDelinkedByCalculationId('abc123', mockTransaction))
      .rejects.toThrow('DB error')
  })
})
