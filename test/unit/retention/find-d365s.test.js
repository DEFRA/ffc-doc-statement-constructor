const db = require('../../../app/data')
const { findD365s } = require('../../../app/retention/find-d365s')

jest.mock('../../../app/data', () => ({
  d365: {
    findAll: jest.fn()
  },
  Sequelize: {
    Op: {
      in: 'in'
    }
  }
}))

describe('findD365s', () => {
  const calculationIds = [1, 2, 3]
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.d365.findAll with correct parameters', async () => {
    const mockResult = [
      { paymentReference: 'PY12345' },
      { paymentReference: 'PY67890' },
    ]
    db.d365.findAll.mockResolvedValue(mockResult)

    const result = await findD365s(calculationIds, transaction)

    expect(db.d365.findAll).toHaveBeenCalledTimes(1)
    expect(db.d365.findAll).toHaveBeenCalledWith({
      attributes: ['paymentReference'],
      where: {
        calculationId: {
          [db.Sequelize.Op.in]: calculationIds
        }
      },
      transaction
    })
    expect(result).toBe(mockResult)
  })

  test('returns empty array when no calculations found', async () => {
    db.d365.findAll.mockResolvedValue([])

    const result = await findD365s(calculationIds, transaction)

    expect(db.d365.findAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual([])
  })

  test('propagates error when db.d365.findAll rejects', async () => {
    const error = new Error('DB error')
    db.d365.findAll.mockRejectedValue(error)

    await expect(findD365s(calculationIds, transaction)).rejects.toThrow('DB error')
  })
})
