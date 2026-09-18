const db = require('../../../../app/data')
const { truncate } = require('../../../helpers/truncate')

const getDaxsForSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/get-daxs-for-sfi-23-quarterly-statement')

const payReferenceOne = 'PY11235452'
const payReferenceTwo = 'PY76726627'
const payReferenceThree = 'IN76726627'
const payReferenceFour = 'PY76726000'

let retrievedDax

describe('process get calculation object', () => {
  beforeAll(async () => {
    await truncate()
  })

  beforeEach(async () => {
    const { type, ...organisation } = structuredClone(require('../../../mock-objects/mock-organisation'))
    const { calculationReference, claimReference, actions, type: _type, ...total } = structuredClone(require('../../../mock-objects/mock-total'))
    const { calculationReference: _calculationReference, type: _daxType, ...dax } = structuredClone(require('../../../mock-objects/mock-dax'))

    retrievedDax = [
      { ...dax, calculationId: calculationReference, paymentReference: payReferenceOne, startPublish: null },
      { ...dax, calculationId: calculationReference, paymentReference: payReferenceTwo, startPublish: null },
      { ...dax, calculationId: calculationReference, paymentReference: payReferenceThree, startPublish: null },
      { ...dax, calculationId: calculationReference, paymentReference: payReferenceFour, startPublish: null }
    ]

    await db.organisations().insert(organisation)
    await db.totals().insert({ ...total, calculationId: calculationReference, claimId: claimReference })
  })

  afterEach(async () => {
    await truncate()
  })

  afterAll(async () => {
    await db.close()
  })

  test('Should return all new dax with startPublish equal null', async () => {
    await db.dax().insert(retrievedDax)
    const transaction = await db.transaction()
    const result = await getDaxsForSfi23QuarterlyStatement(transaction)
    await transaction.commit()
    expect(result.length).toBe(4)
  })

  test('Should not return dax already started or dated today or later', async () => {
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    await db.dax().insert([
      { ...retrievedDax[0], startPublish: new Date() },
      { ...retrievedDax[1], transactionDate: today },
      retrievedDax[2]
    ])
    const transaction = await db.transaction()
    const result = await getDaxsForSfi23QuarterlyStatement(transaction)
    await transaction.commit()
    expect(result.map(dax => dax.paymentReference)).toEqual([payReferenceThree])
  })

  test('Should skip rows locked by another transaction', async () => {
    await db.dax().insert(retrievedDax)
    const locker = await db.transaction()
    await db.dax(locker).where({ paymentReference: payReferenceOne }).forUpdate()

    const transaction = await db.transaction()
    const result = await getDaxsForSfi23QuarterlyStatement(transaction)
    await transaction.commit()
    await locker.rollback()

    expect(result.map(dax => dax.paymentReference)).not.toContain(payReferenceOne)
    expect(result.length).toBe(3)
  })
})
