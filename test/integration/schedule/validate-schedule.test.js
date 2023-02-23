const validateSchedule = require('../../../app/processing/schedule/validate-schedule')

let retrievedSchedule

describe('validate schedule', () => {
  beforeEach(() => {
    const schedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').STATEMENT))
    retrievedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedSchedule', async () => {
    const result = validateSchedule(retrievedSchedule)
    expect(result).toStrictEqual(retrievedSchedule)
  })

  test('should throw when retrievedSchedule is missing required scheduleId', async () => {
    delete retrievedSchedule.scheduleId
    expect(() => validateSchedule(retrievedSchedule)).toThrow()
  })

  test('should throw Error when retrievedSchedule is missing required scheduleId', async () => {
    delete retrievedSchedule.scheduleId
    expect(() => validateSchedule(retrievedSchedule)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "scheduleId" is required" when retrievedSchedule is missing required scheduleId', async () => {
    delete retrievedSchedule.scheduleId
    expect(() => validateSchedule(retrievedSchedule)).toThrow(/does not have the required data: "scheduleId" is required/)
  })

  test('should throw when retrievedSchedule is missing required settlementId', async () => {
    delete retrievedSchedule.settlementId
    expect(() => validateSchedule(retrievedSchedule)).toThrow()
  })

  test('should throw Error when retrievedSchedule is missing required settlementId', async () => {
    delete retrievedSchedule.settlementId
    expect(() => validateSchedule(retrievedSchedule)).toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "settlementId" is required" when retrievedSchedule is missing required settlementId', async () => {
    delete retrievedSchedule.settlementId
    expect(() => validateSchedule(retrievedSchedule)).toThrow(/does not have the required data: "value" must contain at least one of \[settlementId, paymentRequestId\]/)
  })
})
