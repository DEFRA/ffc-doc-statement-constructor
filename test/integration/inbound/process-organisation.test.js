const db = require('../../../app/database')
const { truncate } = require('../../helpers/truncate')
const processOrganisation = require('../../../app/inbound/organisation')

let organisation

describe('process organisation', () => {
  const find = async () => {
    return db.organisations().where({ sbi: organisation.sbi }).first()
  }

  beforeAll(async () => {
    await truncate()
  })

  beforeEach(async () => {
    const original = require('../../mock-objects/mock-organisation')
    organisation = { ...original }
  })

  afterEach(async () => {
    await truncate()
  })

  afterAll(async () => {
    await db.close()
  })

  test('saves an organisation record', async () => {
    await processOrganisation(organisation)
    expect(await find()).toBeDefined()
  })

  test('saves only 1 organisation for the same sbi', async () => {
    await processOrganisation(organisation)
    await processOrganisation(organisation)
    const { count } = await db.organisations().count({ count: '*' }).where({ sbi: organisation.sbi }).first()
    expect(Number(count)).toBe(1)
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
