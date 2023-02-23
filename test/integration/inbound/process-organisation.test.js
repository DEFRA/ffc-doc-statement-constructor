const db = require('../../../app/data')

const processOrganisation = require('../../../app/inbound/organisation')

let organisation

describe('process processing payment request', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    organisation = JSON.parse(JSON.stringify(require('../../mock-objects/mock-organisation')))
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

  test('should save entry into organisation where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into organisation where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.count({ where: { sbi: organisation.sbi } })
    expect(result).toBe(1)
  })

  test('should save entry into organisation with addressLine1 as organisation.addressLine1 where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.addressLine1).toBe(organisation.addressLine1)
  })

  test('should save entry into organisation with addressLine2 as organisation.addressLine2 where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.addressLine2).toBe(organisation.addressLine2)
  })

  test('should save entry into organisation with addressLine3 as organisation.addressLine3 where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.addressLine3).toBe(organisation.addressLine3)
  })

  test('should save entry into organisation with city as organisation.city where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.city).toBe(organisation.city)
  })

  test('should save entry into organisation with county as organisation.county where organisation.sbi', async () => {
    await processOrganisation(organisation)
    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.county).toBe(organisation.county)
  })

  test('should save entry into organisation with emailAddress as organisation.emailAddress where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.emailAddress).toBe(organisation.emailAddress)
  })

  test('should save entry into organisation with frn as organisation.frn where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.frn).toBe(String(organisation.frn))
  })

  test('should save entry into organisation with name as organisation.name where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.name).toBe(organisation.name)
  })

  test('should save entry into organisation with postcode as organisation.postcode where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.postcode).toBe(organisation.postcode)
  })

  test('should save entry into organisation with sbi as organisation.sbi where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.sbi).toBe(organisation.sbi)
  })

  test('should save entry into organisation with updated as organisation.updated where organisation.sbi', async () => {
    await processOrganisation(organisation)

    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.updated).toStrictEqual(new Date(organisation.updated))
  })
})
