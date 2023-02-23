jest.mock('../../../../app/processing/payment-request/has-later-payment-request')
const hasLaterPaymentRequest = require('../../../../app/processing/payment-request/has-later-payment-request')

jest.mock('../../../../app/processing/schedule/void-scheduled-by-schedule-id')
const voidScheduledByScheduleId = require('../../../../app/processing/schedule/void-scheduled-by-schedule-id')

const getRemovedDefunctPaymentSchedules = require('../../../../app/processing/schedule/get-removed-defunct-payment-schedules')

let retrievedSchedules
let started
let transaction

describe('get removed defunct payment schedules', () => {
  beforeEach(() => {
    const schedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-schedule').SCHEDULE))

    const retrievedSchedule = {
      scheduleId: 1,
      paymentRequestId: schedule.paymentRequestId
    }

    retrievedSchedules = [
      { ...retrievedSchedule },
      { ...retrievedSchedule, scheduleId: 2 }
    ]

    started = new Date()
    transaction = {}
    hasLaterPaymentRequest.mockResolvedValue(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call hasLaterPaymentRequest', async () => {
    await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
    expect(hasLaterPaymentRequest).toHaveBeenCalled()
  })

  test('should call hasLaterPaymentRequest twice when 2 retrievedSchedules', async () => {
    await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
    expect(hasLaterPaymentRequest).toHaveBeenCalledTimes(2)
  })

  test('should call hasLaterPaymentRequest with each retrievedSchedule when 2 retrievedSchedules', async () => {
    await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
    expect(hasLaterPaymentRequest).toHaveBeenNthCalledWith(1, retrievedSchedules[0].paymentRequestId, transaction)
    expect(hasLaterPaymentRequest).toHaveBeenNthCalledWith(2, retrievedSchedules[1].paymentRequestId, transaction)
  })

  test('should call voidScheduledByScheduleId once when 1 retrievedSchedule is defunct', async () => {
    hasLaterPaymentRequest.mockResolvedValueOnce(true)
    await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
    expect(voidScheduledByScheduleId).toHaveBeenCalledTimes(1)
  })

  test('should call voidScheduledByScheduleId with the scheduleId of the defunct schedule', async () => {
    hasLaterPaymentRequest.mockResolvedValueOnce(true)
    await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
    expect(voidScheduledByScheduleId).toHaveBeenCalledWith(retrievedSchedules[0].scheduleId, started, transaction)
  })

  test('should call voidScheduledByScheduleId twice when 2 retrievedSchedules are defunct', async () => {
    hasLaterPaymentRequest.mockResolvedValue(true)
    await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
    expect(voidScheduledByScheduleId).toHaveBeenCalledTimes(2)
  })

  test('should call voidScheduledByScheduleId with the scheduleId of the defunct schedules', async () => {
    hasLaterPaymentRequest.mockResolvedValue(true)
    await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
    expect(voidScheduledByScheduleId).toHaveBeenNthCalledWith(1, retrievedSchedules[0].scheduleId, started, transaction)
    expect(voidScheduledByScheduleId).toHaveBeenNthCalledWith(2, retrievedSchedules[1].scheduleId, started, transaction)
  })

  test('should return both retrievedSchedules when both are valid', async () => {
    const result = await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
    expect(result).toStrictEqual(retrievedSchedules)
  })

  test('should not throw when hasLaterPaymentRequest throws both times', async () => {
    hasLaterPaymentRequest.mockRejectedValueOnce(new Error('test error'))
    hasLaterPaymentRequest.mockRejectedValueOnce(new Error('test error'))
    await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
  })

  test('should not throw when hasLaterPaymentRequest throws', async () => {
    hasLaterPaymentRequest.mockRejectedValueOnce(new Error('test error'))
    await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
  })

  test('should not throw when voidScheduledByScheduleId throws', async () => {
    hasLaterPaymentRequest.mockResolvedValue(true)
    voidScheduledByScheduleId.mockRejectedValueOnce(new Error('test error'))
    await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
  })

  test('should return the valid retrievedSchedule when 1 retrievedSchedule is defunct', async () => {
    hasLaterPaymentRequest.mockResolvedValueOnce(true)
    const result = await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
    expect(result).toStrictEqual([retrievedSchedules[1]])
  })

  test('should return the valid retrievedSchedules when 2 retrievedSchedules are defunct', async () => {
    hasLaterPaymentRequest.mockResolvedValue(true)
    const result = await getRemovedDefunctPaymentSchedules(retrievedSchedules, started, transaction)
    expect(result).toStrictEqual([])
  })
})
