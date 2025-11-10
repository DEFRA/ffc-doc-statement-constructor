const db = require('../../../../app/data')

const getDaxsForSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/get-daxs-for-sfi-23-quarterly-statement')

const payReferenceOne = 'PY11235452'
const payReferenceTwo = 'PY76726627'
const payReferenceThree = 'IN76726627'
const payReferenceFour = 'PY76726000'

let retrievedDax

describe('process get calculation object', () => {
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

    retrievedDax = [
      { ...dax, calculationId: calculationReference, paymentReference: payReferenceOne, startPublish: null },
      { ...dax, calculationId: calculationReference, paymentReference: payReferenceTwo, startPublish: null },
      { ...dax, calculationId: calculationReference, paymentReference: payReferenceThree, startPublish: null },
      { ...dax, calculationId: calculationReference, paymentReference: payReferenceFour, startPublish: null }
    ]

    await db.organisation.create(organisation)
    await db.total.create({ ...total, calculationId: calculationReference, claimId: total.claimReference })
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

  test('Should return all new dax with startPublish equal null', async () => {
    await db.dax.bulkCreate(retrievedDax)
    const transaction = await db.sequelize.transaction()
    const result = await getDaxsForSfi23QuarterlyStatement(transaction)
    await transaction.commit()
    expect(result.length).toBe(4)
  })
})
