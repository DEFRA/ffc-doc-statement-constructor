jest.mock('../../../../app/processing/schedule/schema')
const schema = require('../../../../app/processing/schedule/schema')

const validateSchedule = require('../../../../app/processing/schedule/validate-schedule')

let retrievedSchedule

describe('validate schedule', () => {
  beforeEach(() => {
    const schedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-schedule').STATEMENT))

    retrievedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }

    schema.validate.mockReturnValue({ value: retrievedSchedule })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedSchedule', () => {
    const result = validateSchedule(retrievedSchedule)
    expect(result).toBe(retrievedSchedule)
  })

  test('should throw when schema.validate throws', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    expect(() => validateSchedule(retrievedSchedule)).toThrow()
  })

  test('should throw Error when schema.validate throws Error', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateSchedule(retrievedSchedule)).toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateSchedule(retrievedSchedule)).toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    expect(() => validateSchedule(retrievedSchedule)).toThrow()
  })

  test('should throw Error when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateSchedule(retrievedSchedule)).toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    expect(() => validateSchedule(retrievedSchedule)).toThrow(/does not have the required data/)
  })
})
