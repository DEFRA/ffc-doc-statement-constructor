jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/scheme/schema')
const schema = require('../../../../../app/processing/sfi-23-quarterly-statement/scheme/schema')

const validateScheme = require('../../../../../app/processing/sfi-23-quarterly-statement/scheme/validate-scheme')

let retrievedScheme

describe('validate dax', () => {
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

  test('should throw when schema.validate throws', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    expect(() => validateScheme(retrievedScheme)).toThrow()
  })

  test('should throw Error when schema.validate throws Error', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateScheme(retrievedScheme)).toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateScheme(retrievedScheme)).toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    expect(() => validateScheme(retrievedScheme)).toThrow()
  })

  test('should throw Error when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateScheme(retrievedScheme)).toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateScheme(retrievedScheme)).toThrow('Scheme with the Code: undefined does not have the required details data: undefined')
  })
})
