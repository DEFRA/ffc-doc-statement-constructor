const schema = require('../../../../app/inbound/d365/schema')
const validateD365 = require('../../../../app/inbound/d365/validate-d365')

jest.mock('../../../../app/inbound/d365/schema')

describe('validateD365', () => {
  test('should return validated data when validation succeeds', () => {
    const transformedD365 = { validField: 'validValue' }
    const paymentReference = '123'
    const validatedData = { validField: 'validValue' }

    schema.validate.mockReturnValue({ value: validatedData })

    const result = validateD365(transformedD365, paymentReference)
    expect(result).toEqual(validatedData)
  })

  test('should throw validation error when schema validation fails', () => {
    const transformedD365 = { invalidField: 'invalidValue' }
    const paymentReference = '123'
    const validationError = { message: 'Validation error' }

    schema.validate.mockReturnValue({ error: validationError })

    expect(() => validateD365(transformedD365, paymentReference)).toThrow(
      new Error('D365 validation on paymentReference: 123 does not have the required D365 data: Validation error')
    )
  })

  test('should throw validation error with multiple messages when schema validation fails with multiple errors', () => {
    const transformedD365 = { invalidField: 'invalidValue' }
    const paymentReference = '123'
    const validationError = {
      message: 'Validation error',
      details: [
        { message: 'Error 1' },
        { message: 'Error 2' }
      ]
    }

    schema.validate.mockReturnValue({ error: validationError })

    expect(() => validateD365(transformedD365, paymentReference)).toThrow(
      new Error('D365 validation on paymentReference: 123 does not have the required D365 data: Validation error')
    )
  })

  test('should handle empty transformedD365 object', () => {
    const transformedD365 = {}
    const paymentReference = '123'
    const validationError = { message: 'Validation error' }

    schema.validate.mockReturnValue({ error: validationError })

    expect(() => validateD365(transformedD365, paymentReference)).toThrow(
      new Error('D365 validation on paymentReference: 123 does not have the required D365 data: Validation error')
    )
  })

  test('should handle null transformedD365 object', () => {
    const transformedD365 = null
    const paymentReference = '123'
    const validationError = { message: 'Validation error' }

    schema.validate.mockReturnValue({ error: validationError })

    expect(() => validateD365(transformedD365, paymentReference)).toThrow(
      new Error('D365 validation on paymentReference: 123 does not have the required D365 data: Validation error')
    )
  })
})
