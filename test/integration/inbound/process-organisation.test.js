const db = require('../../../app/data')
const processOrganisation = require('../../../app/inbound/organisation')

let organisation

describe('processOrganisation', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({ cascade: true, restartIdentity: true })
  })

  beforeEach(async () => {
    organisation = JSON.parse(JSON.stringify(require('../../mock-objects/mock-organisation')))
  })

  afterEach(async () => {
    await db.sequelize.truncate({ cascade: true, restartIdentity: true })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should save an organisation record when given valid organisation data', async () => {
    await processOrganisation(organisation)
    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result).not.toBeNull()
  })

  test('should only save one record per organisation.sbi', async () => {
    await processOrganisation(organisation)
    const count = await db.organisation.count({ where: { sbi: organisation.sbi } })
    expect(count).toBe(1)
  })

  test.each([
    ['addressLine1'],
    ['addressLine2'],
    ['addressLine3'],
    ['city'],
    ['county'],
    ['emailAddress'],
    ['name'],
    ['postcode'],
    ['sbi']
  ])('should save %s correctly from organisation object', async (field) => {
    await processOrganisation(organisation)
    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result[field]).toBe(organisation[field])
  })

  test('should save frn as a string value', async () => {
    await processOrganisation(organisation)
    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.frn).toBe(String(organisation.frn))
  })

  test('should save updated field as a valid Date', async () => {
    await processOrganisation(organisation)
    const result = await db.organisation.findOne({ where: { sbi: organisation.sbi } })
    expect(result.updated).toStrictEqual(new Date(organisation.updated))
  })
})
