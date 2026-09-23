const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['organisations'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { checkAndRemoveEmptyAddress } = require('../../../../app/inbound/organisation/check-and-remove-empty-address')

describe('checkAndRemoveEmptyAddress', () => {
  const transaction = mockDb.trx
  let organisationWithAddress
  let organisationNoAddress

  beforeEach(() => {
    organisationWithAddress = {
      sbi: '123',
      addressLine1: 'Line 1',
      addressLine2: null,
      addressLine3: null,
      city: 'City',
      county: null,
      postcode: 'PC1 1AA'
    }
    organisationNoAddress = {
      sbi: '456',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      city: null,
      county: null,
      postcode: null
    }
    jest.clearAllMocks()
  })

  test('returns false and does not touch the database if organisation has address', async () => {
    const result = await checkAndRemoveEmptyAddress(organisationWithAddress, transaction)

    expect(result).toBe(false)
    expect(mockDb.tables.organisations).not.toHaveBeenCalled()
  })

  test('deletes organisation if no address and exists in DB', async () => {
    mockDb.builder.resolves(organisationNoAddress)

    const result = await checkAndRemoveEmptyAddress(organisationNoAddress, transaction)

    expect(mockDb.tables.organisations).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ sbi: organisationNoAddress.sbi })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
    expect(result).toBe(true)
  })

  test('does not delete organisation if no address and not in DB', async () => {
    mockDb.builder.resolves(undefined)

    const result = await checkAndRemoveEmptyAddress(organisationNoAddress, transaction)

    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.del).not.toHaveBeenCalled()
    expect(result).toBe(true)
  })
})
