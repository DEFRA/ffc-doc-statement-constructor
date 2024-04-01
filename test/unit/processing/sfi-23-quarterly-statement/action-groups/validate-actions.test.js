jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/schema')
const schema = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/schema')

const validateActions = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/validate-actions')

let retrievedActions

describe('validate actions', () => {
  beforeEach(() => {
    retrievedActions = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-actions')))
    schema.validate.mockReturnValue({ value: retrievedActions })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedActions', () => {
    const result = validateActions(retrievedActions)
    expect(result).toBe(retrievedActions)
  })

  test('should throw when schema.validate throws', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    expect(() => validateActions(retrievedActions)).toThrow()
  })

  test('should throw Error when schema.validate throws Error', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateActions(retrievedActions)).toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateActions(retrievedActions)).toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    expect(() => validateActions(retrievedActions)).toThrow()
  })

  test('should throw Error when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateActions(retrievedActions)).toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateActions(retrievedActions)).toThrow('Total with the CalculationId: undefined has one or more actions with invalid data: undefined')
  })
})
