const db = require('../../../../app/data')
const getExcludedPaymentReferenceByPaymentReference = require('../../../../app/utility/get-excluded-payment-reference-by-payment-reference')

let excludedPaymentReferences

describe('getExcludedPaymentReferenceByPaymentReference', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    excludedPaymentReferences = structuredClone(require('../../../mock-objects/mock-excluded-payment-reference'))
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

  test('should return true when payment reference is present', async () => {
    const result = await getExcludedPaymentReferenceByPaymentReference(excludedPaymentReferences[0].paymentReference)
    expect(result).toBe(true)
  })

  test('should return false when payment reference is not present', async () => {
    const result = await getExcludedPaymentReferenceByPaymentReference('NONEXISTENT123')
    expect(result).toBe(false)
  })
})
