const { createKnexMock } = require('../../../../helpers/mock-knex')

const mockDb = createKnexMock(['organisations'])

jest.mock('../../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getOrganisationBySbi = require('../../../../../app/processing/delinked-statement/organisation/get-organisation-by-sbi')

describe('getOrganisationBySbi', () => {
  const mockOrganisation = {
    sbi: '123456789',
    addressLine1: '123 Main St',
    addressLine2: 'Suite 100',
    addressLine3: '',
    city: 'Any Town',
    county: 'Any County',
    emailAddress: 'test@example.com',
    frn: '987654321',
    name: 'Test Organisation',
    postcode: '12345'
  }

  const columns = [
    'sbi',
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'county',
    'emailAddress',
    'frn',
    'name',
    'postcode'
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return organisation data when found', async () => {
    mockDb.builder.resolves(mockOrganisation)

    const result = await getOrganisationBySbi('123456789')

    expect(result).toEqual(mockOrganisation)
    expect(mockDb.tables.organisations).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.select).toHaveBeenCalledWith(...columns)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ sbi: '123456789' })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
  })

  test('should return null when no organisation is found', async () => {
    mockDb.builder.resolves(undefined)

    const result = await getOrganisationBySbi('123456789')

    expect(result).toBeNull()
  })
})
