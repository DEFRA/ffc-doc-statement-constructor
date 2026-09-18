const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['delinkedCalculations'])

jest.mock('../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeDelinkedCalculations } = require('../../../app/retention/remove-delinked-calculations')

describe('removeDelinkedCalculations', () => {
  const calculationIds = [101, 102, 103]
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(2)
  })

  test('deletes the rows matching the ids against the transaction', async () => {
    await removeDelinkedCalculations(calculationIds, transaction)

    expect(mockDb.tables.delinkedCalculations).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('calculationId', calculationIds)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    mockDb.builder.rejects(new Error('DB destroy error'))

    await expect(removeDelinkedCalculations(calculationIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
