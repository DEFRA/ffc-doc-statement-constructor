const getD365 = require('../../../../../app/processing/delinked-statement/d365/get-d365')

jest.mock('../../../../../app/processing/delinked-statement/d365/get-d365-by-payment-reference')
const getD365ByPaymentReference = require('../../../../../app/processing/delinked-statement/d365/get-d365-by-payment-reference')

jest.mock('../../../../../app/processing/delinked-statement/d365/validate-d365')
const validateD365 = require('../../../../../app/processing/delinked-statement/d365/validate-d365')

describe('getD365', () => {
  const paymentReference = 'ABC123'
  const d365 = { id: 1 }
  const validatedD365 = { id: 1, validated: true }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('calls getD365ByPaymentReference with correct payment reference', async () => {
    getD365ByPaymentReference.mockResolvedValue(d365)
    await getD365(paymentReference)
    expect(getD365ByPaymentReference).toHaveBeenCalledWith(paymentReference)
  })

  test('calls validateD365 with D365 object and payment reference', async () => {
    getD365ByPaymentReference.mockResolvedValue(d365)
    validateD365.mockReturnValue(validatedD365)
    await getD365(paymentReference)
    expect(validateD365).toHaveBeenCalledWith(d365, paymentReference)
  })

  test('returns validated D365 object', async () => {
    getD365ByPaymentReference.mockResolvedValue(d365)
    validateD365.mockReturnValue(validatedD365)
    const result = await getD365(paymentReference)
    expect(result).toBe(validatedD365)
  })
})
