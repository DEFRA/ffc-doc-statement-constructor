const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['d365'])

jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeD365 } = require('../../../app/retention/remove-d365')

describe('removeD365', () => {
  const calculationIds = [101, 102, 103]
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(2)
  })

  test('deletes the rows matching the ids against the transaction', async () => {
    await removeD365(calculationIds, transaction)

    expect(mockDb.tables.d365).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('calculationId', calculationIds)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    mockDb.builder.rejects(new Error('DB destroy error'))

    await expect(removeD365(calculationIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
