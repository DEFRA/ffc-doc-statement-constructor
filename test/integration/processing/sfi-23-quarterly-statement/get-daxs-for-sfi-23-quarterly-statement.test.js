const db = require('../../../../app/data')
const getDaxsForSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/get-daxs-for-sfi-23-quarterly-statement')

const payReferences = [
  'PY11235452',
  'PY76726627',
  'IN76726627',
  'PY76726000'
]

describe('getDaxsForSfi23QuarterlyStatement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))
    const total = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-total')))
    const dax = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-dax')))
    const calculationReference = total.calculationReference

    const retrievedDax = payReferences.map((paymentReference) => ({
      ...dax,
      calculationId: calculationReference,
      paymentReference,
      startPublish: null
    }))

    await db.organisation.create(organisation)
    await db.total.create({
      ...total,
      calculationId: calculationReference,
      claimId: total.claimReference
    })
    await db.dax.bulkCreate(retrievedDax)
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

  test('should return all dax records with startPublish equal to null', async () => {
    const transaction = await db.sequelize.transaction()
    const result = await getDaxsForSfi23QuarterlyStatement(transaction)
    await transaction.commit()

    expect(result).toHaveLength(4)
    expect(result.every(dax => dax.startPublish === null)).toBe(true)
  })
})
