const db = require('../../../../app/data')
const { truncate } = require('../../../helpers/truncate')

const getExcludedPaymentReferenceByPaymentReference = require('../../../../app/utility/get-excluded-payment-reference-by-payment-reference')

let excludedPaymentReferences

describe('process get document type by code', () => {
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

  test('getExcludedPaymentReferenceByPaymentReference returns true when present', async () => {
    const result = await getExcludedPaymentReferenceByPaymentReference(excludedPaymentReferences[0].paymentReference)
    expect(result).toBe(true)
  })

  test('getExcludedPaymentReferenceByPaymentReference returns false when not present', async () => {
    const result = await getExcludedPaymentReferenceByPaymentReference('123456')
    expect(result).toBe(false)
  })
})
