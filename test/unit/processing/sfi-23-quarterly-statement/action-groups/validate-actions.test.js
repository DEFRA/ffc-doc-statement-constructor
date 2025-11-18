jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/schema')
const schema = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/schema')
const validateActions = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/validate-actions')

let retrievedActions

describe('validate actions', () => {
  beforeEach(() => {
    retrievedActions = structuredClone(require('../../../../mock-objects/mock-actions'))
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
    expect(() => validateActions(retrievedActions)).toThrow(Error)
    expect(() => validateActions(retrievedActions)).toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateActions(retrievedActions)).toThrow()
    expect(() => validateActions(retrievedActions)).toThrow(Error)
    expect(() => validateActions(retrievedActions)).toThrow(
      'Total with the CalculationId: undefined has one or more actions with invalid data: undefined'
    )
  })
})
