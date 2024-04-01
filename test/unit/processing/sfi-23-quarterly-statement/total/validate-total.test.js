jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/total/schema')
const schema = require('../../../../../app/processing/sfi-23-quarterly-statement/total/schema')

const validateTotal = require('../../../../../app/processing/sfi-23-quarterly-statement/total/validate-total')

let retrievedTotal

describe('validate dax', () => {
  beforeEach(() => {
    retrievedTotal = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-total')))
    schema.validate.mockReturnValue({ value: retrievedTotal })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedTotal', () => {
    const result = validateTotal(retrievedTotal)
    expect(result).toBe(retrievedTotal)
  })

  test('should throw when schema.validate throws', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    expect(() => validateTotal(retrievedTotal)).toThrow()
  })

  test('should throw Error when schema.validate throws Error', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateTotal(retrievedTotal)).toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateTotal(retrievedTotal)).toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    expect(() => validateTotal(retrievedTotal)).toThrow()
  })

  test('should throw Error when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateTotal(retrievedTotal)).toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateTotal(retrievedTotal)).toThrow('Total with the CalculationId: undefined does not have the required details data: undefined')
  })
})
