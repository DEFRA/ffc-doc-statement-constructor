const schema = require('../../../../app/inbound/d365/schema')
const validateD365 = require('../../../../app/inbound/d365/validate-d365')

jest.mock('../../../../app/inbound/d365/schema')

describe('validateD365', () => {
  const paymentReference = '123'

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return validated data when validation succeeds', () => {
    const transformedD365 = { validField: 'validValue' }
    const validatedData = { validField: 'validValue' }

    schema.validate.mockReturnValue({ value: validatedData })

    const result = validateD365(transformedD365, paymentReference)
    expect(result).toEqual(validatedData)
    expect(schema.validate).toHaveBeenCalledWith(transformedD365, { abortEarly: false })
  })

  test.each([
    { desc: 'invalid object', transformedD365: { invalidField: 'invalidValue' } },
    { desc: 'empty object', transformedD365: {} },
    { desc: 'null object', transformedD365: null },
    { desc: 'multiple validation errors', transformedD365: { invalidField: 'invalidValue' } }
  ])('should throw validation error for $desc', ({ transformedD365 }) => {
    const validationError = {
      message: 'Validation error',
      details: transformedD365?.invalidField ? [{ message: 'Error 1' }, { message: 'Error 2' }] : undefined
    }

    schema.validate.mockReturnValue({ error: validationError })

    expect(() => validateD365(transformedD365, paymentReference)).toThrow(
      'D365 validation on paymentReference: 123 does not have the required D365 data: Validation error'
    )
    expect(schema.validate).toHaveBeenCalledWith(transformedD365, { abortEarly: false })
  })
})
