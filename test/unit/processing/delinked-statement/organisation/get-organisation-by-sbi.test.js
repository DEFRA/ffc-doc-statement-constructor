const db = require('../../../../../app/data')
const getOrganisationBySbi = require('../../../../../app/processing/delinked-statement/organisation/get-organisation-by-sbi')

jest.mock('../../../../../app/data')

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

  const attributes = [
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
    db.organisation.findOne.mockReset()
  })

  test('should return organisation data when found', async () => {
    db.organisation.findOne.mockResolvedValue(mockOrganisation)

    const result = await getOrganisationBySbi('123456789')

    expect(result).toEqual(mockOrganisation)
    expect(db.organisation.findOne).toHaveBeenCalledTimes(1)
    expect(db.organisation.findOne).toHaveBeenCalledWith({
      attributes,
      where: { sbi: '123456789' },
      raw: true
    })
  })

  test('should return null when no organisation is found', async () => {
    db.organisation.findOne.mockResolvedValue(null)

    const result = await getOrganisationBySbi('123456789')

    expect(result).toBeNull()
    expect(db.organisation.findOne).toHaveBeenCalledTimes(1)
    expect(db.organisation.findOne).toHaveBeenCalledWith({
      attributes,
      where: { sbi: '123456789' },
      raw: true
    })
  })
})
