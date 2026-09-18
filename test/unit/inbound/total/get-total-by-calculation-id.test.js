const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['totals'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getTotalByCalculationId = require('../../../../app/inbound/total/get-total-by-calculation-id')

describe('getTotalByCalculationId', () => {
  const transaction = mockDb.trx
  const row = { calculationId: 12345 }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns the row when one exists', async () => {
    mockDb.builder.resolves(row)

    const result = await getTotalByCalculationId(12345, transaction)

    expect(mockDb.tables.totals).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ calculationId: 12345 })
    expect(mockDb.builder.forUpdate).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(result).toEqual(row)
  })

  test('returns null when no row exists', async () => {
    mockDb.builder.resolves(undefined)

    const result = await getTotalByCalculationId(12345, transaction)

    expect(result).toBeNull()
  })

  test('propagates a query failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(getTotalByCalculationId(12345, transaction)).rejects.toThrow('DB error')
  })
})
