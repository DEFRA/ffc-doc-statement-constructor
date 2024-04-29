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

  test('should throw when schema.validate throws', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    expect(() => validateDax(retrievedDax)).toThrow()
  })

  test('should throw Error when schema.validate throws Error', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateDax(retrievedDax)).toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateDax(retrievedDax)).toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    expect(() => validateDax(retrievedDax)).toThrow()
  })

  test('should throw Error when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateDax(retrievedDax)).toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateDax(retrievedDax)).toThrow('Dax record with the payment reference: undefined does not have the required details data: undefined')
  })
})
