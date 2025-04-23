const saveOrganisation = require('../../../../app/inbound/organisation/save-organisation')
const db = require('../../../../app/data')

jest.mock('../../../../app/data', () => ({
  organisation: {
    upsert: jest.fn()
  }
}))

describe('saveOrganisation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('should call upsert with organization record', async () => {
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
      updated: new Date('2022-12-31')
    }

    db.organisation.upsert.mockResolvedValue([organisation, true])

    const result = await saveOrganisation(organisation)

    expect(db.organisation.upsert).toHaveBeenCalledWith({
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
    }, {
      transaction: undefined,
      raw: true
    })
    expect(result).toEqual([organisation, true])
  })

  test('should use current date when updated is not provided', async () => {
    const organisation = {
      sbi: 123456789,
      addressLine1: '1 Test Street',
      city: 'Test City',
      frn: 1234567890,
      name: 'Test Organization'
    }

    await saveOrganisation(organisation)

    expect(db.organisation.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        updated: new Date('2023-01-01')
      }),
      expect.any(Object)
    )
  })

  test('should pass transaction to upsert when provided', async () => {
    const organisation = { sbi: 123456789, name: 'Test Organization' }
    const transaction = { id: 'transaction-id' }

    await saveOrganisation(organisation, transaction)

    expect(db.organisation.upsert).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        transaction,
        raw: true
      })
    )
  })

  test('should handle minimal organisation data', async () => {
    const minimalOrg = { sbi: 123456789 }

    await saveOrganisation(minimalOrg)

    expect(db.organisation.upsert).toHaveBeenCalledWith({
      sbi: 123456789,
      addressLine1: undefined,
      addressLine2: undefined,
      addressLine3: undefined,
      city: undefined,
      county: undefined,
      emailAddress: undefined,
      frn: undefined,
      name: undefined,
      postcode: undefined,
      updated: expect.any(Date)
    }, {
      transaction: undefined,
      raw: true
    })
  })
})
