const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['delinkedCalculations'])

jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { findDelinkedCalculations } = require('../../../app/retention/find-delinked-calculations')

describe('findDelinkedCalculations', () => {
  const applicationId = 'AGR-001'
  const frn = 1234567890
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('selects the matching rows against the transaction', async () => {
    const mockResult = [{ id: 1 }, { id: 2 }]
    mockDb.builder.resolves(mockResult)

    const result = await findDelinkedCalculations(applicationId, frn, transaction)

    expect(mockDb.tables.delinkedCalculations).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.select).toHaveBeenCalledWith('calculationId', 'sbi')
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId, frn })
    expect(result).toBe(mockResult)
  })

  test('returns empty array when nothing matches', async () => {
    mockDb.builder.resolves([])

    const result = await findDelinkedCalculations(applicationId, frn, transaction)

    expect(result).toEqual([])
  })

  test('propagates error when the query rejects', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(findDelinkedCalculations(applicationId, frn, transaction)).rejects.toThrow('DB error')
  })
})
