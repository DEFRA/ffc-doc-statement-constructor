jest.useFakeTimers()
jest.spyOn(global, 'setTimeout')

jest.mock('../../../app/config')
const { processingConfig } = require('../../../app/config')

const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}
jest.mock('../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

jest.mock('../../../app/processing/schedule')
const { schedulePendingSettlements, schedulePendingPaymentSchedules } = require('../../../app/processing/schedule')

jest.mock('../../../app/messaging/wait-for-idle-messaging')
const waitForIdleMessaging = require('../../../app/messaging/wait-for-idle-messaging')

jest.mock('../../../app/processing/statement')
const { getStatement, sendStatement, validateStatement } = require('../../../app/processing/statement')

jest.mock('../../../app/processing/payment-schedule')
const { getPaymentSchedule, sendPaymentSchedule, validatePaymentSchedule } = require('../../../app/processing/payment-schedule')

jest.mock('../../../app/processing/update-schedule-by-schedule-id')
const updateScheduleByScheduleId = require('../../../app/processing/update-schedule-by-schedule-id')

const processing = require('../../../app/processing')

let retrievedSchedule
let statement

let retrievedPaymentSchedule

describe('start processing', () => {
  beforeEach(() => {
    processingConfig.settlementProcessingInterval = 10000
    processingConfig.statementConstructionActive = true
    processingConfig.scheduleConstructionActive = true
    const schedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').STATEMENT))
    retrievedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }
    const paymentSchedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').SCHEDULE))
    retrievedPaymentSchedule = {
      scheduleId: 1,
      paymentRequestId: paymentSchedule.paymentRequestId
    }

    statement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-statement')))

    schedulePendingSettlements.mockResolvedValue([retrievedSchedule])
    getStatement.mockResolvedValue(statement)
    validateStatement.mockReturnValue(true)
    sendStatement.mockResolvedValue(undefined)

    schedulePendingPaymentSchedules.mockResolvedValue([retrievedPaymentSchedule])
    getPaymentSchedule.mockResolvedValue(paymentSchedule)
    validatePaymentSchedule.mockReturnValue(true)
    sendPaymentSchedule.mockResolvedValue(undefined)

    updateScheduleByScheduleId.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call schedulePendingSettlements', async () => {
    await processing.start()
    expect(schedulePendingSettlements).toHaveBeenCalled()
  })

  test('should call schedulePendingSettlements once if construction active', async () => {
    await processing.start()
    expect(schedulePendingSettlements).toHaveBeenCalledTimes(1)
  })

  test('should not call schedulePendingSettlements if construction not active', async () => {
    processingConfig.statementConstructionActive = false
    await processing.start()
    expect(schedulePendingSettlements).not.toHaveBeenCalled()
  })

  test('should call schedulePendingPaymentSchedules', async () => {
    await processing.start()
    expect(schedulePendingPaymentSchedules).toHaveBeenCalled()
  })

  test('should call schedulePendingPaymentSchedules once if schedule construction active', async () => {
    await processing.start()
    expect(schedulePendingPaymentSchedules).toHaveBeenCalledTimes(1)
  })

  test('should not call schedulePendingPaymentSchedules if schedule construction not active', async () => {
    processingConfig.scheduleConstructionActive = false
    await processing.start()
    expect(schedulePendingPaymentSchedules).not.toHaveBeenCalled()
  })

  test('should call setTimeout if construction is active', async () => {
    processingConfig.statementConstructionActive = true
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout if construction is not active', async () => {
    processingConfig.statementConstructionActive = false
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout if schedule construction is active', async () => {
    processingConfig.scheduleConstructionActive = true
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout if schedule construction is not active', async () => {
    processingConfig.scheduleConstructionActive = false
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call waitForIdleMessaging twice if all construction active', async () => {
    await processing.start()
    expect(waitForIdleMessaging).toHaveBeenCalledTimes(2)
  })

  test('should call waitForIdleMessaging once if construction active and schedule construction not active', async () => {
    processingConfig.scheduleConstructionActive = false
    await processing.start()
    expect(waitForIdleMessaging).toHaveBeenCalledTimes(1)
  })

  test('should call waitForIdleMessaging once if construction not active and schedule construction active', async () => {
    processingConfig.statementConstructionActive = false
    await processing.start()
    expect(waitForIdleMessaging).toHaveBeenCalledTimes(1)
  })

  test('should call getStatement when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(getStatement).toHaveBeenCalled()
  })

  test('should call getStatement once when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(getStatement).toHaveBeenCalledTimes(1)
  })

  test('should call getStatement with schedulePendingSettlements()[0].settlementId and mockTransaction when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(getStatement).toHaveBeenCalledWith((await schedulePendingSettlements())[0].settlementId)
  })

  test('should call getStatement when schedulePendingSettlements returns 2 records', async () => {
    schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processing.start()
    expect(getStatement).toHaveBeenCalled()
  })

  test('should call getStatement twice when schedulePendingSettlements returns 2 records', async () => {
    schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processing.start()
    expect(getStatement).toHaveBeenCalledTimes(2)
  })

  test('should call getStatement with each schedulePendingSettlements().settlementId and mockTransaction when schedulePendingSettlements returns 2 records', async () => {
    schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule])

    await processing.start()

    expect(getStatement).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].settlementId)
    expect(getStatement).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].settlementId)
  })

  test('should not call getStatement when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])
    await processing.start()
    expect(getStatement).not.toHaveBeenCalled()
  })

  test('should call getPaymentSchedule when schedulePendingSchedules returns 1 record', async () => {
    await processing.start()
    expect(getPaymentSchedule).toHaveBeenCalled()
  })

  test('should call getPaymentSchedule once when schedulePendingSchedules returns 1 record', async () => {
    await processing.start()
    expect(getPaymentSchedule).toHaveBeenCalledTimes(1)
  })

  test('should call getPaymentSchedule with schedulePendingSchedules()[0].paymentScheduleId and mockTransaction when schedulePendingSchedules returns 1 record', async () => {
    await processing.start()
    expect(getPaymentSchedule).toHaveBeenCalledWith((await schedulePendingPaymentSchedules())[0].paymentRequestId)
  })

  test('should not call getPaymentSchedule when schedulePendingSchedules returns an empty array', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([])
    await processing.start()
    expect(getPaymentSchedule).not.toHaveBeenCalled()
  })

  test('should call getPaymentSchedule when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processing.start()
    expect(getPaymentSchedule).toHaveBeenCalled()
  })

  test('should call getPaymentSchedule twice when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processing.start()
    expect(getPaymentSchedule).toHaveBeenCalledTimes(2)
  })

  test('should call getPaymentSchedule with each schedulePendingSchedules().paymentScheduleId and mockTransaction when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])

    await processing.start()

    expect(getPaymentSchedule).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].paymentRequestId)
    expect(getPaymentSchedule).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[1].paymentRequestId)
  })

  test('should call getPaymentSchedule when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processing.start()
    expect(getPaymentSchedule).toHaveBeenCalled()
  })

  test('should call getPaymentSchedule twice when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processing.start()
    expect(getPaymentSchedule).toHaveBeenCalledTimes(2)
  })

  test('should call getPaymentSchedule with each schedulePendingSchedules().paymentScheduleId and mockTransaction when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processing.start()
    expect(getPaymentSchedule).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].paymentScheduleId)
    expect(getPaymentSchedule).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[1].paymentScheduleId)
  })

  test('should not call getPaymentSchedule when schedulePendingSchedules returns an empty array', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([])
    await processing.start()
    expect(getPaymentSchedule).not.toHaveBeenCalled()
  })

  test('should call validateStatement when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(validateStatement).toHaveBeenCalled()
  })

  test('should call validateStatement once when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(validateStatement).toHaveBeenCalledTimes(1)
  })

  test('should call validateStatement with statement when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(validateStatement).toHaveBeenCalledWith(statement)
  })

  test('should call sendStatement when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(sendStatement).toHaveBeenCalled()
  })

  test('should call sendStatement once when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(sendStatement).toHaveBeenCalledTimes(1)
  })

  test('should call sendStatement with schedulePendingSettlements()[0].scheduleId and getStatement when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(sendStatement).toHaveBeenCalledWith(await getStatement())
  })

  test('should call sendStatement when schedulePendingSettlements returns 2 records', async () => {
    schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processing.start()
    expect(sendStatement).toHaveBeenCalled()
  })

  test('should call sendStatement twice when schedulePendingSettlements returns 2 records', async () => {
    schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processing.start()
    expect(sendStatement).toHaveBeenCalledTimes(2)
  })

  test('should call sendStatement with each schedulePendingSettlements().scheduleId and getStatement when schedulePendingSettlements returns 2 records', async () => {
    schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule])

    await processing.start()

    expect(sendStatement).toHaveBeenNthCalledWith(1, await getStatement())
    expect(sendStatement).toHaveBeenNthCalledWith(2, await getStatement())
  })

  test('should not call sendStatement when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])
    await processing.start()
    expect(sendStatement).not.toHaveBeenCalled()
  })

  test('should not call sendStatement if validateStatement returns false', async () => {
    validateStatement.mockReturnValue(false)
    await processing.start()
    expect(sendStatement).not.toHaveBeenCalled()
  })

  test('should call sendPaymentSchedule when schedulePendingPaymentSchedules returns 1 record', async () => {
    await processing.start()
    expect(sendPaymentSchedule).toHaveBeenCalled()
  })

  test('should call sendPaymentSchedule once when schedulePendingPaymentSchedules returns 1 record', async () => {
    await processing.start()
    expect(sendPaymentSchedule).toHaveBeenCalledTimes(1)
  })

  test('should call sendPaymentSchedule with schedulePendingPaymentSchedules()[0].paymentScheduleId and getPaymentSchedule when schedulePendingPaymentSchedules returns 1 record', async () => {
    await processing.start()
    expect(sendPaymentSchedule).toHaveBeenCalledWith(await getPaymentSchedule())
  })

  test('should call updateScheduleByScheduleId when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(updateScheduleByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduleByScheduleId twice when schedulePendingSettlements and schedulePendingPaymentSchedules both return 1 record', async () => {
    await processing.start()
    expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(2)
  })

  test('should call updateScheduleByScheduleId once when schedulePendingSettlements and schedulePendingPaymentSchedules both return 1 record and schedule construction not active', async () => {
    processingConfig.scheduleConstructionActive = false
    await processing.start()
    expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(1)
  })

  test('should call updateScheduleByScheduleId once when schedulePendingSettlements and schedulePendingPaymentSchedules both return 1 record and construction not active', async () => {
    processingConfig.statementConstructionActive = false
    await processing.start()
    expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(1)
  })

  test('should call updateScheduleByScheduleId with schedulePendingSettlements()[0].scheduleId and mockTransaction when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(updateScheduleByScheduleId).toHaveBeenCalledWith((await schedulePendingSettlements())[0].scheduleId)
  })

  test('should not throw when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processing.start()
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])

    const wrapper = async () => {
      await processing.start()
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when getStatement throws', async () => {
    getStatement.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processing.start()
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when sendStatement throws', async () => {
    sendStatement.mockRejectedValue(new Error('Sending issue'))

    const wrapper = async () => {
      await processing.start()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call setTimeout', async () => {
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout once', async () => {
    await processing.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval', async () => {
    await processing.start()
    expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
  })

  test('should call setTimeout when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout once when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
  })

  test('should call setTimeout when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout once when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])
    await processing.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])
    await processing.start()
    expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
  })

  test('should call setTimeout when getStatement throws', async () => {
    getStatement.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout once when getStatement throws', async () => {
    getStatement.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval when getStatement throws', async () => {
    getStatement.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
  })

  test('should call setTimeout when sendStatement throws', async () => {
    sendStatement.mockRejectedValue(new Error('Sending issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout once when sendStatement throws', async () => {
    sendStatement.mockRejectedValue(new Error('Sending issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval when sendStatement throws', async () => {
    sendStatement.mockRejectedValue(new Error('Sending issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
  })

  test('should not block processing of subsequent statements when getStatement throws', async () => {
    schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    getStatement.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(getStatement).toHaveBeenCalledTimes(2)
  })

  test('should not block processing of subsequent statements when sendStatement throws', async () => {
    schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    sendStatement.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(getStatement).toHaveBeenCalledTimes(2)
  })
})
