jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/dax/schema')
const schema = require('../../../../../app/processing/sfi-23-quarterly-statement/dax/schema')
const validateDax = require('../../../../../app/processing/sfi-23-quarterly-statement/dax/validate-dax')

let retrievedDax

describe('validate dax', () => {
  beforeEach(() => {
    retrievedDax = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-dax')))
    schema.validate.mockReturnValue({ value: retrievedDax })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedDax', () => {
    const result = validateDax(retrievedDax)
    expect(result).toBe(retrievedDax)
  })

  test('should return retrievedDax and not throw error when no paymentPeriod', () => {
    delete retrievedDax.paymentPeriod
    const result = validateDax(retrievedDax)
    expect(result).toBe(retrievedDax)
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
      expectedMessage: 'Dax record with the payment reference: undefined does not have the required details data: undefined'
    }
  ])('$name', ({ mockImplementation, returnValue, expectedMessage }) => {
    if (mockImplementation) {
      schema.validate.mockImplementation(mockImplementation)
    }
    if (returnValue) {
      schema.validate.mockReturnValue(returnValue)
    }

    expect(() => validateDax(retrievedDax)).toThrow(expectedMessage)
  })
})
