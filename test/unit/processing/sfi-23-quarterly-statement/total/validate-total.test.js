jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/total/schema')
const schema = require('../../../../../app/processing/sfi-23-quarterly-statement/total/schema')
const validateTotal = require('../../../../../app/processing/sfi-23-quarterly-statement/total/validate-total')

let retrievedTotal

describe('validate total', () => {
  beforeEach(() => {
    retrievedTotal = structuredClone(require('../../../../mock-objects/mock-total'))
    schema.validate.mockReturnValue({ value: retrievedTotal })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedTotal', () => {
    const result = validateTotal(retrievedTotal)
    expect(result).toBe(retrievedTotal)
  })

  test.each([
    {
      name: 'throws when schema.validate throws Error',
      mockImplementation: () => { throw new Error('Joi validation issue') },
      expectedMessage: /^Joi validation issue$/
    },
    {
      name: 'throws when schema.validate returns error key',
      mockImplementation: null,
      returnValue: { error: 'Not a valid object' },
      expectedMessage: 'Total with the CalculationId: undefined does not have the required details data: undefined'
    }
  ])('$name', ({ mockImplementation, returnValue, expectedMessage }) => {
    if (mockImplementation) schema.validate.mockImplementation(mockImplementation)
    if (returnValue) schema.validate.mockReturnValue(returnValue)

    expect(() => validateTotal(retrievedTotal)).toThrow(expectedMessage)
  })
})
