const getDax = require('../../../../../app/processing/sfi-23-quarterly-statement/dax/get-dax')

jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/dax/get-dax-by-payment-reference')
const getDaxByPaymentReference = require('../../../../../app/processing/sfi-23-quarterly-statement/dax/get-dax-by-payment-reference')

jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/dax/validate-dax')
const validateDax = require('../../../../../app/processing/sfi-23-quarterly-statement/dax/validate-dax')

describe('getDax', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getDaxByPaymentReference with the correct payment reference', async () => {
    const paymentReference = 'ABC123'
    await getDax(paymentReference)
    expect(getDaxByPaymentReference).toHaveBeenCalledWith(paymentReference)
  })

  test('should call validateDax with the returned dax and payment reference', async () => {
    const paymentReference = 'ABC123'
    const dax = { /* mocked dax object */ }
    getDaxByPaymentReference.mockResolvedValue(dax)
    await getDax(paymentReference)
    expect(validateDax).toHaveBeenCalledWith(dax, paymentReference)
  })

  test('should return the validated dax', async () => {
    const paymentReference = 'ABC123'
    const validatedDax = { /* mocked validated dax object */ }
    validateDax.mockReturnValue(validatedDax)
    const result = await getDax(paymentReference)
    expect(result).toBe(validatedDax)
  })
})
