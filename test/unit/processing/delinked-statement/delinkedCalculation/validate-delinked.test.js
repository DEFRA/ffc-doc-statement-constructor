jest.mock('../../../../../app/processing/delinked-statement/delinkedCalculation/schema')
const schema = require('../../../../../app/processing/delinked-statement/delinkedCalculation/schema')

const validateDelinked = require('../../../../../app/processing/delinked-statement/delinkedCalculation/validate-delinked')

let retrievedDelinked

describe('validate delinked', () => {
  beforeEach(() => {
    retrievedDelinked = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-delinked')))
    schema.validate.mockReturnValue({ value: retrievedDelinked })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedDelinked', () => {
    const result = validateDelinked(retrievedDelinked)
    expect(result).toBe(retrievedDelinked)
  })

  test('should throw when schema.validate throws', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    expect(() => validateDelinked(retrievedDelinked)).toThrow()
  })

  test('should throw Error when schema.validate throws Error', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateDelinked(retrievedDelinked)).toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateDelinked(retrievedDelinked)).toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    expect(() => validateDelinked(retrievedDelinked)).toThrow()
  })

  test('should throw Error when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateDelinked(retrievedDelinked)).toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateDelinked(retrievedDelinked)).toThrow('Delinked with the CalculationId: undefined does not have the required details data: undefined')
  })
})
