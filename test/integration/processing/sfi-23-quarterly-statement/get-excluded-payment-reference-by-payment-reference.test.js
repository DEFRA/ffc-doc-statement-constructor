const db = require('../../../../app/data')

const getExcludedPaymentReferenceByPaymentReference = require('../../../../app/processing/sfi-23-quarterly-statement/get-excluded-payment-reference-by-payment-reference')

let excludedPaymentReferences

describe('process get document type by code', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    excludedPaymentReferences = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-excluded-payment-reference')))
    await db.excludedPaymentReference.bulkCreate(excludedPaymentReferences)
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

  test('getExcludedPaymentReferenceByPaymentReference returns when present', async () => {
    const result = await getExcludedPaymentReferenceByPaymentReference(excludedPaymentReferences[0].paymentReference)
    expect(result.paymentReference).toBe(excludedPaymentReferences[0].paymentReference)
  })
})
