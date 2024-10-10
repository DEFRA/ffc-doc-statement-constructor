const validateOrganisation = require('../../../../../app/processing/delinked-statement/organisation/validate-organisation')
const schema = require('../../../../../app/processing/delinked-statement/organisation/schema')

jest.mock('../../../../../app/processing/delinked-statement/organisation/schema')

describe('validate Organisation', () => {
  const sbi = '123456789'
  const validOrganisation = { name: 'Test Organisation', id: 'org123' }
  const invalidOrganisation = { name: '' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return validated organisation when schema validation passes', () => {
    schema.validate.mockReturnValue({ value: validOrganisation })

    const result = validateOrganisation(validOrganisation, sbi)

    expect(result).toEqual(validOrganisation)
    expect(schema.validate).toHaveBeenCalledWith(validOrganisation, { abortEarly: false })
  })

  test('should throw an error when schema validation fails', () => {
    const validationError = new Error('Validation error')
    schema.validate.mockReturnValue({ error: validationError })

    expect(() => validateOrganisation(invalidOrganisation, sbi)).toThrow(`Organisation with the sbi: ${sbi} does not have the required details data: ${validationError.message}`)
    expect(schema.validate).toHaveBeenCalledWith(invalidOrganisation, { abortEarly: false })
  })
})
