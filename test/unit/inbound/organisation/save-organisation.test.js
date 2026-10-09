const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['organisations'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const saveOrganisation = require('../../../../app/inbound/organisation/save-organisation')

describe('saveOrganisation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('upserts the full organisation record on sbi', async () => {
    const organisation = {
      sbi: 123456789,
      addressLine1: '1 Test Street',
      addressLine2: 'Test Area',
      addressLine3: 'Test District',
      city: 'Test City',
      county: 'Test County',
      emailAddress: 'test@example.com',
      frn: 1234567890,
      name: 'Test Organization',
      postcode: 'TE1 1ST',
      updated: new Date('2022-12-31'),
      type: 'organisation'
    }

    await saveOrganisation(organisation)

    expect(mockDb.builder.insert).toHaveBeenCalledWith({
      sbi: organisation.sbi,
      addressLine1: organisation.addressLine1,
      addressLine2: organisation.addressLine2,
      addressLine3: organisation.addressLine3,
      city: organisation.city,
      county: organisation.county,
      emailAddress: organisation.emailAddress,
      frn: organisation.frn,
      name: organisation.name,
      postcode: organisation.postcode,
      updated: organisation.updated
    })
    expect(mockDb.builder.onConflict).toHaveBeenCalledWith('sbi')
    expect(mockDb.builder.merge).toHaveBeenCalledTimes(1)
  })

  test('uses current date when updated is not provided', async () => {
    await saveOrganisation({ sbi: 123456789, name: 'Test Organization' })

    expect(mockDb.builder.insert).toHaveBeenCalledWith(expect.objectContaining({ updated: new Date('2023-01-01') }))
  })

  test('runs against the transaction when provided', async () => {
    await saveOrganisation({ sbi: 123456789, name: 'Test Organization' }, mockDb.trx)

    expect(mockDb.tables.organisations).toHaveBeenCalledWith(mockDb.trx)
  })

  test('falls back to the client when no transaction is provided', async () => {
    await saveOrganisation({ sbi: 123456789 })

    expect(mockDb.tables.organisations).toHaveBeenCalledWith(undefined)
  })

  test('propagates an upsert failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(saveOrganisation({ sbi: 123456789 })).rejects.toThrow('DB error')
  })
})
