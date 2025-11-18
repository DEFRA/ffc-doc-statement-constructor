const db = require('../../../../app/data')
const getOrganisation = require('../../../../app/processing/organisation')

let organisation
let retrievedOrganisation
let sbi

describe('getOrganisation', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({ cascade: true, restartIdentity: true })
  })

  beforeEach(async () => {
    organisation = structuredClone(require('../../../mock-objects/mock-organisation'))

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

  test('should resolve successfully when organisation data exists for sbi', async () => {
    await db.organisation.create(retrievedOrganisation)
    await expect(getOrganisation(sbi)).resolves.not.toThrow()
  })

  test('should return correctly mapped organisation object', async () => {
    await db.organisation.create(retrievedOrganisation)

    const result = await getOrganisation(sbi)
    expect(result).toStrictEqual({
      line1: retrievedOrganisation.addressLine1,
      line2: retrievedOrganisation.addressLine2,
      line3: retrievedOrganisation.addressLine3,
      line4: retrievedOrganisation.city,
      line5: retrievedOrganisation.county,
      postcode: retrievedOrganisation.postcode,
      businessName: retrievedOrganisation.name,
      email: retrievedOrganisation.emailAddress,
      frn: retrievedOrganisation.frn,
      sbi: retrievedOrganisation.sbi
    })
  })

  test.each([
    ['frn', null, true],
    ['postcode', null, false],
    ['emailAddress', null, false],
    ['sbi', 10500000, true]
  ])(
    'should %s %s %s error when organisation data is invalid',
    async (field, invalidValue, shouldThrow) => {
      retrievedOrganisation[field] = invalidValue
      await db.organisation.create(retrievedOrganisation)

      const wrapper = async () => getOrganisation(retrievedOrganisation.sbi)
      if (shouldThrow) {
        await expect(wrapper()).rejects.toThrow()
      } else {
        await expect(wrapper()).resolves.not.toThrow()
      }
    }
  )

  test('should throw error when no matching record exists for provided sbi', async () => {
    await db.organisation.create(retrievedOrganisation)
    sbi = 124534678
    await expect(getOrganisation(sbi)).rejects.toThrow()
  })
})
