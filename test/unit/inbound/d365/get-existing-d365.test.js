const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['d365'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getExistingD365 = require('../../../../app/inbound/d365/get-existing-d365')

describe('getExistingD365', () => {
  const d365 = { paymentReference: 'PY12345', paymentPeriod: 'Q4-2025', paymentAmount: '100.00', transactionDate: '2026-01-01', type: 'd365' }
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('looks up a locked row by the identifying fields against the transaction', async () => {
    mockDb.builder.resolves({})

    await getExistingD365(d365, transaction)

    expect(mockDb.tables.d365).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({
      paymentReference: 'PY12345',
      paymentPeriod: 'Q4-2025',
      paymentAmount: '100.00',
      transactionDate: '2026-01-01'
    })
    expect(mockDb.builder.forUpdate).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
  })

  test('falls back to the client when no transaction is supplied', async () => {
    mockDb.builder.resolves(undefined)

    await getExistingD365(d365)

    expect(mockDb.tables.d365).toHaveBeenCalledWith(undefined)
  })

  test('returns the matching record', async () => {
    const expected = { d365Id: 1, calculationId: 123, paymentReference: 'PY12345' }
    mockDb.builder.resolves(expected)

    const result = await getExistingD365(d365, transaction)

    expect(result).toBe(expected)
  })

  test('returns null when there is no match', async () => {
    mockDb.builder.resolves(undefined)

    const result = await getExistingD365(d365, transaction)

    expect(result).toBeNull()
  })
})
