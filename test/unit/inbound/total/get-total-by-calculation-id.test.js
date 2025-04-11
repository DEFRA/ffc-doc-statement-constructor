// __tests__/getTotalByCalculationId.test.js

const db = require('../../../../app/data')
const getTotalByCalculationId = require('../../../../app/inbound/total/get-total-by-calculation-id') // adjust the path

jest.mock('../../../../app/data')

describe('getTotalByCalculationId', () => {
  const mockTransaction = { id: 'mock-tx' }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return { calculationId } if count > 0', async () => {
    db.total.count.mockResolvedValue(1)

    const result = await getTotalByCalculationId('12345', mockTransaction)

    expect(db.total.count).toHaveBeenCalledWith({
      transaction: mockTransaction,
      where: { calculationId: '12345' },
      limit: 1
    })
    expect(result).toEqual({ calculationId: '12345' })
  })

  test('should return null if count is 0', async () => {
    db.total.count.mockResolvedValue(0)

    const result = await getTotalByCalculationId('12345', mockTransaction)

    expect(db.total.count).toHaveBeenCalledWith({
      transaction: mockTransaction,
      where: { calculationId: '12345' },
      limit: 1
    })
    expect(result).toBeNull()
  })
})
