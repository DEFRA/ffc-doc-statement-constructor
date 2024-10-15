jest.mock('../../../../../app/processing/delinked-statement/d365/schema')
const schema = require('../../../../../app/processing/delinked-statement/d365/schema')

const validateD365 = require('../../../../../app/processing/delinked-statement/d365/validate-d365')

let retrievedD365

describe('validate d365', () => {
  beforeEach(() => {
    retrievedD365 = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-d365')))
    schema.validate.mockReturnValue({ value: retrievedD365 })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedD365', () => {
    const result = validateD365(retrievedD365)
    expect(result).toBe(retrievedD365)
  })

  test('should return retrievedD365 and not throw error when no paymentPeriod', () => {
    delete retrievedD365.paymentPeriod
    const result = validateD365(retrievedD365)
    expect(result).toBe(retrievedD365)
  })

  test('should throw when schema.validate throws', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    expect(() => validateD365(retrievedD365)).toThrow()
  })

  test('should throw Error when schema.validate throws Error', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateD365(retrievedD365)).toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateD365(retrievedD365)).toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    expect(() => validateD365(retrievedD365)).toThrow()
  })

  test('should throw Error when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateD365(retrievedD365)).toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateD365(retrievedD365)).toThrow('D365 record with the payment reference: undefined does not have the required details data: undefined')
  })
})
