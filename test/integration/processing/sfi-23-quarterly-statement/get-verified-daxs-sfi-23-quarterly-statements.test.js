const db = require('../../../../app/database')
const { truncate } = require('../../../helpers/truncate')
const getExcludedPaymentReferenceByPaymentReference = require('../../../../app/utility/get-excluded-payment-reference-by-payment-reference')

let excludedPaymentReferences

describe('getExcludedPaymentReferenceByPaymentReference', () => {
  beforeAll(async () => {
    await truncate()
  })

  beforeEach(async () => {
    excludedPaymentReferences = structuredClone(require('../../../mock-objects/mock-excluded-payment-reference'))
    await db.excludedPaymentReferences().insert(excludedPaymentReferences)
  })

  afterEach(async () => {
    await truncate()
  })

  afterAll(async () => {
    await db.close()
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
