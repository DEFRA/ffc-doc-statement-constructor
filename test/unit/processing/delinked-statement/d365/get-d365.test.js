const getD365 = require('../../../../../app/processing/delinked-statement/d365/get-d365')

jest.mock('../../../../../app/processing/delinked-statement/d365/get-d365-by-payment-reference')
const getD365ByPaymentReference = require('../../../../../app/processing/delinked-statement/d365/get-d365-by-payment-reference')

jest.mock('../../../../../app/processing/delinked-statement/d365/validate-d365')
const validateD365 = require('../../../../../app/processing/delinked-statement/d365/validate-d365')

describe('getD365', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getD365ByPaymentReference with the correct payment reference', async () => {
    const paymentReference = 'ABC123'
    await getD365(paymentReference)
    expect(getD365ByPaymentReference).toHaveBeenCalledWith(paymentReference)
  })

  test('should call validateD365 with the returned d365 and payment reference', async () => {
    const paymentReference = 'ABC123'
    const d365 = { /* mocked dax object */ }
    getD365ByPaymentReference.mockResolvedValue(d365)
    await getD365(paymentReference)
    expect(validateD365).toHaveBeenCalledWith(d365, paymentReference)
  })

  test('should return the validated d365', async () => {
    const paymentReference = 'ABC123'
    const validatedD365 = { /* mocked validated dax object */ }
    validateD365.mockReturnValue(validatedD365)
    const result = await getD365(paymentReference)
    expect(result).toBe(validatedD365)
  })
})
