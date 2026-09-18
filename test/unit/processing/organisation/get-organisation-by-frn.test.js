const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['organisations'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getOrganisationByFrn = require('../../../../app/processing/organisation/get-organisation-by-frn')

describe('getOrganisationByFrn', () => {
  const transaction = mockDb.trx
  const row = { frn: 1234567890 }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns the row when one exists', async () => {
    mockDb.builder.resolves(row)

    const result = await getOrganisationByFrn(1234567890, transaction)

    expect(mockDb.tables.organisations).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.select).toHaveBeenCalledWith('sbi')
    expect(mockDb.builder.where).toHaveBeenCalledWith({ frn: 1234567890 })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(result).toEqual(row)
  })

  test('returns null when no row exists', async () => {
    mockDb.builder.resolves(undefined)

    const result = await getOrganisationByFrn(1234567890, transaction)

    expect(result).toBeNull()
  })

  test('propagates a query failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(getOrganisationByFrn(1234567890, transaction)).rejects.toThrow('DB error')
  })
})
