const db = require('../../../app/data')
const processOrganisation = require('../../../app/inbound/organisation')

let organisation

describe('process organisation', () => {
  const find = () => db.organisation.findOne({ where: { sbi: organisation.sbi } })

  const truncate = () =>
    db.sequelize.truncate({ cascade: true, restartIdentity: true })

  beforeAll(async () => {
    await truncate()
  })

  beforeEach(async () => {
    // clone the mock while keeping Dates intact
    const original = require('../../mock-objects/mock-organisation')
    organisation = { ...original } // shallow clone preserves Date
  })

  afterEach(async () => {
    await truncate()
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('saves an organisation record', async () => {
    await processOrganisation(organisation)
    expect(await find()).not.toBeNull()
  })

  test('saves only 1 organisation for the same sbi', async () => {
    await processOrganisation(organisation)
    const count = await db.organisation.count({ where: { sbi: organisation.sbi } })
    expect(count).toBe(1)
  })

  const fieldTests = [
    ['addressLine1'],
    ['addressLine2'],
    ['addressLine3'],
    ['city'],
    ['county'],
    ['emailAddress'],
    ['frn', val => String(val)],
    ['name'],
    ['postcode'],
    ['sbi'],
    ['updated', val => new Date(val)]
  ]

  test.each(fieldTests)(
    'saves %s correctly',
    async (field, transform = v => v) => {
      await processOrganisation(organisation)
      const result = await find()
      expect(result[field]).toStrictEqual(transform(organisation[field]))
    }
  )
})
