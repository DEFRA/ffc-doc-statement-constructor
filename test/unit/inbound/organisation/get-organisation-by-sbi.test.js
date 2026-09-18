const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['organisations'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getOrganisationBySbi = require('../../../../app/inbound/organisation/get-organisation-by-sbi')

describe('getOrganisationBySbi', () => {
  const transaction = mockDb.trx
  const row = { sbi: 123456789 }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns the row when one exists', async () => {
    mockDb.builder.resolves(row)

    const result = await getOrganisationBySbi(123456789, transaction)

    expect(mockDb.tables.organisations).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ sbi: 123456789 })
    expect(mockDb.builder.forUpdate).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(result).toEqual(row)
  })

  test('returns null when no row exists', async () => {
    mockDb.builder.resolves(undefined)

    const result = await getOrganisationBySbi(123456789, transaction)

    expect(result).toBeNull()
  })

  test('propagates a query failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(getOrganisationBySbi(123456789, transaction)).rejects.toThrow('DB error')
  })
})
