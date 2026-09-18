const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['d365'])

jest.mock('../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { findD365s } = require('../../../app/retention/find-d365s')

describe('findD365s', () => {
  const calculationIds = [1, 2, 3]
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('selects the matching rows against the transaction', async () => {
    const mockResult = [{ id: 1 }, { id: 2 }]
    mockDb.builder.resolves(mockResult)

    const result = await findD365s(calculationIds, transaction)

    expect(mockDb.tables.d365).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.select).toHaveBeenCalledWith('paymentReference')
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('calculationId', calculationIds)
    expect(result).toBe(mockResult)
  })

  test('returns empty array when nothing matches', async () => {
    mockDb.builder.resolves([])

    const result = await findD365s(calculationIds, transaction)

    expect(result).toEqual([])
  })

  test('propagates error when the query rejects', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(findD365s(calculationIds, transaction)).rejects.toThrow('DB error')
  })
})
