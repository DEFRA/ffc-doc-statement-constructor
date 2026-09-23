const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['delinkedCalculations'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getDelinkedByCalculationId = require('../../../../app/inbound/delinked/get-delinked-by-calculation-id')

describe('getDelinkedByCalculationId', () => {
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns the calculation id when a row exists', async () => {
    mockDb.builder.resolves({ calculationId: 'abc123' })

    const result = await getDelinkedByCalculationId('abc123', transaction)

    expect(mockDb.tables.delinkedCalculations).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ calculationId: 'abc123' })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ calculationId: 'abc123' })
  })

  test('returns null when no row exists', async () => {
    mockDb.builder.resolves(undefined)

    const result = await getDelinkedByCalculationId('abc123', transaction)

    expect(result).toBeNull()
  })

  test('propagates a query failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(getDelinkedByCalculationId('abc123', transaction)).rejects.toThrow('DB error')
  })
})
