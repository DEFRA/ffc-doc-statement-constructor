jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/scheme/schema')
const schema = require('../../../../../app/processing/sfi-23-quarterly-statement/scheme/schema')
const validateScheme = require('../../../../../app/processing/sfi-23-quarterly-statement/scheme/validate-scheme')

let retrievedScheme

describe('validate scheme', () => {
  beforeEach(() => {
    retrievedScheme = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-scheme')))
    schema.validate.mockReturnValue({ value: retrievedScheme })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedScheme', () => {
    const result = validateScheme(retrievedScheme)
    expect(result).toBe(retrievedScheme)
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
      expectedMessage: 'Scheme with the Code: undefined does not have the required details data: undefined'
    }
  ])('$name', ({ mockImplementation, returnValue, expectedMessage }) => {
    if (mockImplementation) schema.validate.mockImplementation(mockImplementation)
    if (returnValue) schema.validate.mockReturnValue(returnValue)

    expect(() => validateScheme(retrievedScheme)).toThrow(expectedMessage)
  })
})
