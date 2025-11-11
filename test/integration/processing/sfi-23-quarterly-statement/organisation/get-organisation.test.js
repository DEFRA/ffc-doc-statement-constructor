const db = require('../../../../../app/data')
const getOrganisation = require('../../../../../app/processing/sfi-23-quarterly-statement/organisation/get-organisation')

let organisation
let retrievedOrganisation
let sbi

describe('getOrganisation', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({ cascade: true, restartIdentity: true })
  })

  beforeEach(async () => {
    organisation = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-organisation')))
    retrievedOrganisation = {
      addressLine1: organisation.addressLine1,
      addressLine2: organisation.addressLine2,
      addressLine3: organisation.addressLine3,
      city: organisation.city,
      county: organisation.county,
      postcode: organisation.postcode,
      name: organisation.name,
      emailAddress: organisation.emailAddress,
      frn: organisation.frn,
      sbi: organisation.sbi
    }
    sbi = organisation.sbi
  })

  afterEach(async () => {
    await db.sequelize.truncate({ cascade: true, restartIdentity: true })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should throw error when no existing organisation data', async () => {
    await expect(getOrganisation(sbi)).rejects.toThrow()
  })

  test('should not throw error when organisation exists with valid data', async () => {
    await db.organisation.create(retrievedOrganisation)
    await expect(getOrganisation(sbi)).resolves.not.toThrow()
  })

  test('should return mapped organisation when organisation exists with valid data', async () => {
    await db.organisation.create(retrievedOrganisation)
    const result = await getOrganisation(sbi)

    expect(result).toStrictEqual({
      addressLine1: retrievedOrganisation.addressLine1,
      addressLine2: retrievedOrganisation.addressLine2,
      addressLine3: retrievedOrganisation.addressLine3,
      city: retrievedOrganisation.city,
      county: retrievedOrganisation.county,
      postcode: retrievedOrganisation.postcode,
      name: retrievedOrganisation.name,
      emailAddress: retrievedOrganisation.emailAddress,
      frn: retrievedOrganisation.frn,
      sbi: retrievedOrganisation.sbi
    })
  })

  test('should throw error when organisation exists but frn is missing', async () => {
    retrievedOrganisation.frn = null
    await db.organisation.create(retrievedOrganisation)
    await expect(getOrganisation(sbi)).rejects.toThrow()
  })

  test.each([
    ['postcode'],
    ['emailAddress']
  ])('should not throw error when organisation is missing optional field: %s', async (optionalField) => {
    retrievedOrganisation[optionalField] = null
    await db.organisation.create(retrievedOrganisation)
    await expect(getOrganisation(sbi)).resolves.not.toThrow()
  })

  test('should throw error when organisation sbi is less than 105000000', async () => {
    retrievedOrganisation.sbi = 10500000
    await db.organisation.create(retrievedOrganisation)
    await expect(getOrganisation(retrievedOrganisation.sbi)).rejects.toThrow()
  })

  test('should throw error when no organisation record matches provided sbi', async () => {
    await db.organisation.create(retrievedOrganisation)
    sbi = 124534678
    await expect(getOrganisation(sbi)).rejects.toThrow()
  })
})
