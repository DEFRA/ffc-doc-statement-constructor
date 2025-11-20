const schema = require('../../../../app/inbound/delinked/schema')
const validateDelinked = require('../../../../app/inbound/delinked/validate-delinked')

jest.mock('../../../../app/inbound/delinked/schema')

describe('validateDelinked', () => {
  const calculationId = 'calculationId1'
  const validDelinked = structuredClone(require('../../../mock-objects/mock-delinked'))

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return the validated value when schema validation succeeds', () => {
    schema.validate.mockReturnValue({ value: validDelinked })

    const result = validateDelinked(validDelinked, calculationId)

    expect(result).toEqual(validDelinked)
    expect(schema.validate).toHaveBeenCalledWith(validDelinked, { abortEarly: false })
  })

  test('should throw an error when schema validation fails', () => {
    const errorMessage = 'Validation error'
    schema.validate.mockReturnValue({ error: new Error(errorMessage) })

    expect(() => validateDelinked({}, calculationId)).toThrow(
      `Total with calculationId: ${calculationId} does not have the required DELINKED data: ${errorMessage}`
    )
    expect(schema.validate).toHaveBeenCalledWith({}, { abortEarly: false })
  })
})
