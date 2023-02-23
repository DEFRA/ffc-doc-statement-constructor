const db = require('../../../../app/data')

const getOrganisation = require('../../../../app/processing/organisation')

let organisation
let retrievedOrganisation
let sbi

describe('process get calculation object', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))

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
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should throw error when no existing organisation data', async () => {
    const wrapper = async () => {
      await getOrganisation(sbi)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw error when no existing organisation data', async () => {
    const wrapper = async () => {
      await getOrganisation(sbi)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should not throw error when there is existing organisation data with sbi, and other valid data', async () => {
    await db.organisation.create(retrievedOrganisation)

    const wrapper = async () => {
      await getOrganisation(sbi)
    }

    expect(wrapper()).resolves.not.toThrow()
  })

  test('should return mapped organisation when there is existing organisation data with sbi, and other valid data', async () => {
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

  test('should throw error when there is existing organisation data with sbi but no frn', async () => {
    retrievedOrganisation.frn = null
    await db.organisation.create(retrievedOrganisation)

    const wrapper = async () => {
      await getOrganisation(sbi)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should not throw error when there is existing organisation data with sbi but no postcode', async () => {
    retrievedOrganisation.postcode = null
    await db.organisation.create(retrievedOrganisation)

    const wrapper = async () => {
      await getOrganisation(sbi)
    }

    await expect(wrapper()).resolves.not.toThrow()
  })

  test('should not throw error when there is existing organisation data with sbi but no emailAddress', async () => {
    retrievedOrganisation.emailAddress = null
    await db.organisation.create(retrievedOrganisation)

    const wrapper = async () => {
      await getOrganisation(sbi)
    }

    await expect(wrapper()).resolves.not.toThrow()
  })

  test('should throw error when there is existing organisation data with sbi but sbi less than 105000000', async () => {
    retrievedOrganisation.sbi = 10500000
    await db.organisation.create(retrievedOrganisation)

    const wrapper = async () => {
      await getOrganisation(retrievedOrganisation.sbi)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw error when there is data in organisation table but no corresponding record with provided sbi', async () => {
    await db.organisation.create(retrievedOrganisation)
    sbi = 124534678

    const wrapper = async () => {
      await getOrganisation(sbi)
    }

    expect(wrapper).rejects.toThrow()
  })
})
