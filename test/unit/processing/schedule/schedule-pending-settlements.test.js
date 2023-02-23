jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 12, 0, 0, 0))

const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

jest.mock('../../../../app/processing/schedule/get-scheduled-settlements')
const getScheduledSettlements = require('../../../../app/processing/schedule/get-scheduled-settlements')

jest.mock('../../../../app/processing/schedule/get-valid-scheduled')
const getValidScheduled = require('../../../../app/processing/schedule/get-valid-scheduled')

jest.mock('../../../../app/processing/schedule/get-updated-scheduled')
const getUpdatedScheduled = require('../../../../app/processing/schedule/get-updated-scheduled')

const schedulePendingSettlements = require('../../../../app/processing/schedule/schedule-pending-settlements')

let retrievedSchedules

describe('batch schedule', () => {
  beforeEach(() => {
    mockCommit.mockResolvedValue(undefined)
    mockRollback.mockResolvedValue(undefined)

    const schedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-schedule').STATEMENT))

    const retrievedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }

    retrievedSchedules = [
      { ...retrievedSchedule },
      { ...retrievedSchedule, scheduleId: 2 }
    ]

    getScheduledSettlements.mockResolvedValue(retrievedSchedules)
    getValidScheduled.mockReturnValue(retrievedSchedules)
    getUpdatedScheduled.mockResolvedValue(retrievedSchedules)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getScheduledSettlements', async () => {
    await schedulePendingSettlements()
    expect(getScheduledSettlements).toHaveBeenCalled()
  })

  test('should call getScheduledSettlements once', async () => {
    await schedulePendingSettlements()
    expect(getScheduledSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements with new Date() and mockTransaction', async () => {
    await schedulePendingSettlements()
    expect(getScheduledSettlements).toHaveBeenCalledWith(new Date(), mockTransaction)
  })

  test('should call getValidScheduledSettlements', async () => {
    await schedulePendingSettlements()
    expect(getValidScheduled).toHaveBeenCalled()
  })

  test('should call getValidScheduledSettlements once when getScheduledSettlements returns 2 schedule records', async () => {
    await schedulePendingSettlements()
    expect(getValidScheduled).toHaveBeenCalledTimes(1)
  })

  test('should call getValidScheduledSettlements with each retrievedSchedules when getScheduledSettlements returns 2 schedule records', async () => {
    await schedulePendingSettlements()
    expect(getValidScheduled).toHaveBeenCalledWith(retrievedSchedules)
  })

  test('should call getUpdatedScheduledSettlements', async () => {
    await schedulePendingSettlements()
    expect(getUpdatedScheduled).toHaveBeenCalled()
  })

  test('should call getUpdatedScheduledSettlements once when getValidScheduledSettlements returns 2 schedules', async () => {
    await schedulePendingSettlements()
    expect(getUpdatedScheduled).toHaveBeenCalledTimes(1)
  })

  test('should call getUpdatedScheduledSettlements with retrievedSchedules, new Date() and mockTransaction when getValidScheduledSettlements returns 2 valid schedule records', async () => {
    await schedulePendingSettlements()
    expect(getUpdatedScheduled).toHaveBeenCalledWith(retrievedSchedules, new Date(), mockTransaction)
  })

  test('should call mockTransaction.commit', async () => {
    await schedulePendingSettlements()
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once', async () => {
    await schedulePendingSettlements()
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should return retrievedSchedules', async () => {
    const result = await schedulePendingSettlements()
    expect(result).toStrictEqual(retrievedSchedules)
  })

  test('should not call mockTransaction.rollback', async () => {
    await schedulePendingSettlements()
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should not throw when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await schedulePendingSettlements()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await schedulePendingSettlements() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await schedulePendingSettlements() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not call getValidScheduledSettlements when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await schedulePendingSettlements() } catch { }
    expect(getValidScheduled).not.toHaveBeenCalled()
  })

  test('should not call getUpdatedScheduledSettlements when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await schedulePendingSettlements() } catch { }
    expect(getUpdatedScheduled).not.toHaveBeenCalled()
  })

  test('should not call mockTransaction.commit when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await schedulePendingSettlements() } catch { }
    expect(mockTransaction.commit).not.toHaveBeenCalled()
  })

  test('should not throw when getValidScheduledSettlements throws', async () => {
    getValidScheduled.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await schedulePendingSettlements()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when getValidScheduledSettlements throws', async () => {
    getValidScheduled.mockImplementation(() => { throw Error('Joi validation issue') })
    await schedulePendingSettlements()
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getValidScheduledSettlements throws', async () => {
    getValidScheduled.mockImplementation(() => { throw Error('Joi validation issue') })
    await schedulePendingSettlements()
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not call getUpdatedScheduledSettlements when getValidScheduledSettlements throws', async () => {
    getValidScheduled.mockImplementation(() => { throw Error('Joi validation issue') })
    await schedulePendingSettlements()
    expect(getUpdatedScheduled).not.toHaveBeenCalled()
  })

  test('should not call mockTransaction.commit when getValidScheduledSettlements throws', async () => {
    getValidScheduled.mockImplementation(() => { throw Error('Joi validation issue') })
    await schedulePendingSettlements()
    expect(mockTransaction.commit).not.toHaveBeenCalled()
  })

  test('should not throw when getUpdatedScheduledSettlements throws', async () => {
    getUpdatedScheduled.mockRejectedValue(new Error('Database update issue'))

    const wrapper = async () => {
      await schedulePendingSettlements()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when getUpdatedScheduledSettlements throws', async () => {
    getUpdatedScheduled.mockRejectedValue(new Error('Database update issue'))
    await schedulePendingSettlements()
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getUpdatedScheduledSettlements throws', async () => {
    getUpdatedScheduled.mockRejectedValue(new Error('Database update issue'))
    await schedulePendingSettlements()
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not return the corresponding thrown schedule when getUpdatedScheduledSettlements throws then resolves', async () => {
    getUpdatedScheduled.mockReset()
      .mockRejectedValueOnce(new Error('Database update issue'))
      .mockResolvedValueOnce(retrievedSchedules[1])

    const result = await schedulePendingSettlements()

    expect(result).not.toStrictEqual([retrievedSchedules[0]])
  })

  test('should return the corresponding resolved schedule when getUpdatedScheduledSettlements throws then resolves', async () => {
    getUpdatedScheduled.mockReset()
      .mockRejectedValueOnce(new Error('Database update issue'))
      .mockResolvedValueOnce([retrievedSchedules[1]])

    await schedulePendingSettlements()
    const result = await schedulePendingSettlements()

    expect(result).toStrictEqual([retrievedSchedules[1]])
  })

  test('should return an empty array if both schedules passed to getUpdatedScheduledSettlements throw', async () => {
    getUpdatedScheduled.mockReset()
      .mockRejectedValueOnce(new Error('Database update issue'))
      .mockRejectedValueOnce(new Error('Database update issue'))

    const result = await schedulePendingSettlements()

    expect(result).toStrictEqual([])
  })

  test('should not throw when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await schedulePendingSettlements()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await schedulePendingSettlements() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await schedulePendingSettlements() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })
})
