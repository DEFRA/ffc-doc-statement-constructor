jest.mock('../../../app/processing/schedule')
const { schedulePendingPaymentSchedules } = require('../../../app/processing/schedule')

jest.mock('../../../app/processing/payment-schedule')
const { getPaymentSchedule, sendPaymentSchedule, validatePaymentSchedule } = require('../../../app/processing/payment-schedule')

jest.mock('../../../app/processing/update-schedule-by-schedule-id')
const updateScheduleByScheduleId = require('../../../app/processing/update-schedule-by-schedule-id')

const processPaymentSchedules = require('../../../app/processing/process-payment-schedules')

let retrievedPaymentSchedule
let schedule

describe('process payment schedules', () => {
  beforeEach(() => {
    const paymentSchedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').SCHEDULE))
    retrievedPaymentSchedule = {
      scheduleId: 1,
      paymentRequestId: paymentSchedule.paymentRequestId
    }

    schedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-payment-schedule')))

    schedulePendingPaymentSchedules.mockResolvedValue([retrievedPaymentSchedule])
    sendPaymentSchedule.mockResolvedValue(undefined)
    updateScheduleByScheduleId.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call schedulePendingPaymentSchedules', async () => {
    await processPaymentSchedules()
    expect(schedulePendingPaymentSchedules).toHaveBeenCalled()
  })

  test('should call schedulePendingPaymentSchedules', async () => {
    await processPaymentSchedules()
    expect(schedulePendingPaymentSchedules).toHaveBeenCalled()
  })

  test('should call schedulePendingPaymentSchedules once if schedule construction active', async () => {
    await processPaymentSchedules()
    expect(schedulePendingPaymentSchedules).toHaveBeenCalledTimes(1)
  })

  test('should throw error when schedulePendingPaymentSchedules throws', async () => {
    schedulePendingPaymentSchedules.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processPaymentSchedules()
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schedulePendingPaymentSchedules throws Error', async () => {
    schedulePendingPaymentSchedules.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processPaymentSchedules()
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Processing issue" when schedulePendingPaymentSchedules throws error "Processing issue"', async () => {
    schedulePendingPaymentSchedules.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processPaymentSchedules()
    }

    expect(wrapper).rejects.toThrow(/^Processing issue$/)
  })

  describe('when schedulePendingPaymentSchedules returns 1 record', () => {
    beforeEach(async () => {
      schedulePendingPaymentSchedules.mockResolvedValue([retrievedPaymentSchedule])
      getPaymentSchedule.mockResolvedValue(schedule)
    })

    test('should call getPaymentSchedule', async () => {
      await processPaymentSchedules()
      expect(getPaymentSchedule).toHaveBeenCalled()
    })

    test('should call getPaymentSchedule once', async () => {
      await processPaymentSchedules()
      expect(getPaymentSchedule).toHaveBeenCalledTimes(1)
    })

    test('should call getPaymentSchedule with schedulePendingSchedules().paymentRequestId and schedulePendingSchedules().scheduleId', async () => {
      await processPaymentSchedules()
      expect(getPaymentSchedule).toHaveBeenCalledWith((await schedulePendingPaymentSchedules())[0].paymentRequestId, (await schedulePendingPaymentSchedules())[0].scheduleId)
    })

    test('should call validatePaymentSchedule', async () => {
      await processPaymentSchedules()
      expect(validatePaymentSchedule).toHaveBeenCalled()
    })

    test('should call validatePaymentSchedule once', async () => {
      await processPaymentSchedules()
      expect(validatePaymentSchedule).toHaveBeenCalledTimes(1)
    })

    test('should call validatePaymentSchedule with getPaymentSchedule()', async () => {
      await processPaymentSchedules()
      expect(validatePaymentSchedule).toHaveBeenCalledWith(await getPaymentSchedule())
    })

    describe('when validatePaymentSchedule returns true', () => {
      beforeEach(() => {
        validatePaymentSchedule.mockReturnValue(true)
      })

      test('should call sendPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalled()
      })

      test('should call sendPaymentSchedule once', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalledTimes(1)
      })

      test('should call sendPaymentSchedule with getPaymentSchedule()', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalledWith(await getPaymentSchedule())
      })

      test('should not throw when sendPaymentSchedule throws', async () => {
        sendPaymentSchedule.mockRejectedValue(new Error('Sending issue'))

        const wrapper = async () => {
          await processPaymentSchedules()
        }

        expect(wrapper).not.toThrow()
      })
    })

    describe('when validatePaymentSchedule returns false', () => {
      beforeEach(() => {
        validatePaymentSchedule.mockReturnValue(false)
      })

      test('should not call sendPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).not.toHaveBeenCalled()
      })
    })

    test('should call updateScheduleByScheduleId', async () => {
      await processPaymentSchedules()
      expect(updateScheduleByScheduleId).toHaveBeenCalled()
    })

    test('should call updateScheduleByScheduleId once', async () => {
      await processPaymentSchedules()
      expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(1)
    })

    test('should call updateScheduleByScheduleId with schedulePendingPaymentSchedules().scheduleId', async () => {
      await processPaymentSchedules()
      expect(updateScheduleByScheduleId).toHaveBeenCalledWith((await schedulePendingPaymentSchedules())[0].scheduleId)
    })

    test('should return undefined', async () => {
      const result = await processPaymentSchedules()
      expect(result).toBeUndefined()
    })

    test('should not throw when getPaymentSchedule throws', async () => {
      getPaymentSchedule.mockRejectedValue(new Error('Processing issue'))

      const wrapper = async () => {
        await processPaymentSchedules()
      }

      expect(wrapper).not.toThrow()
    })

    test('should not throw when validatePaymentSchedule throws', async () => {
      validatePaymentSchedule.mockReturnValue(new Error('Processing issue'))

      const wrapper = async () => {
        await processPaymentSchedules()
      }

      expect(wrapper).not.toThrow()
    })

    test('should not throw when updateScheduleByScheduleId throws', async () => {
      updateScheduleByScheduleId.mockRejectedValue(new Error('Update issue'))

      const wrapper = async () => {
        await processPaymentSchedules()
      }

      expect(wrapper).not.toThrow()
    })
  })

  describe('when schedulePendingPaymentSchedules returns 2 records', () => {
    beforeEach(async () => {
      schedulePendingPaymentSchedules.mockResolvedValue([retrievedPaymentSchedule, retrievedPaymentSchedule])
      getPaymentSchedule.mockResolvedValueOnce(schedule).mockResolvedValueOnce(schedule)
    })

    test('should call getPaymentSchedule', async () => {
      await processPaymentSchedules()
      expect(getPaymentSchedule).toHaveBeenCalled()
    })

    test('should call getPaymentSchedule twice', async () => {
      await processPaymentSchedules()
      expect(getPaymentSchedule).toHaveBeenCalledTimes(2)
    })

    test('should call getPaymentSchedule with each schedulePendingSchedules().paymentRequestId and schedulePendingSchedules().scheduleId', async () => {
      await processPaymentSchedules()

      expect(getPaymentSchedule).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].paymentRequestId, (await schedulePendingPaymentSchedules())[0].scheduleId)
      expect(getPaymentSchedule).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[1].paymentRequestId, (await schedulePendingPaymentSchedules())[1].scheduleId)
    })

    test('should call validatePaymentSchedule', async () => {
      await processPaymentSchedules()
      expect(validatePaymentSchedule).toHaveBeenCalled()
    })

    test('should call validatePaymentSchedule twice', async () => {
      await processPaymentSchedules()
      expect(validatePaymentSchedule).toHaveBeenCalledTimes(2)
    })

    test('should call validatePaymentSchedule with each getPaymentSchedule()', async () => {
      await processPaymentSchedules()

      expect(validatePaymentSchedule).toHaveBeenNthCalledWith(1, await getPaymentSchedule())
      expect(validatePaymentSchedule).toHaveBeenNthCalledWith(2, await getPaymentSchedule())
    })

    describe('when validatePaymentSchedule returns true', () => {
      beforeEach(() => {
        validatePaymentSchedule.mockReturnValueOnce(true).mockReturnValueOnce(true)
      })

      test('should call sendPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalled()
      })

      test('should call sendPaymentSchedule twice', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalledTimes(2)
      })

      test('should call sendPaymentSchedule with getPaymentSchedule()', async () => {
        await processPaymentSchedules()

        expect(sendPaymentSchedule).toHaveBeenNthCalledWith(1, await getPaymentSchedule())
        expect(sendPaymentSchedule).toHaveBeenNthCalledWith(2, await getPaymentSchedule())
      })
    })

    describe('when validatePaymentSchedule returns false', () => {
      beforeEach(() => {
        validatePaymentSchedule.mockReturnValueOnce(false).mockReturnValueOnce(false)
      })

      test('should not call sendPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).not.toHaveBeenCalled()
      })
    })

    test('should call updateScheduleByScheduleId', async () => {
      await processPaymentSchedules()
      expect(updateScheduleByScheduleId).toHaveBeenCalled()
    })

    test('should call updateScheduleByScheduleId twice', async () => {
      await processPaymentSchedules()
      expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(2)
    })

    test('should call updateScheduleByScheduleId with each schedulePendingPaymentSchedules().scheduleId', async () => {
      await processPaymentSchedules()

      expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].scheduleId)
      expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[1].scheduleId)
    })

    test('should return undefined', async () => {
      const result = await processPaymentSchedules()
      expect(result).toBeUndefined()
    })
  })

  describe('when schedulePendingPaymentSchedules returns 0 records', () => {
    beforeEach(async () => {
      schedulePendingPaymentSchedules.mockResolvedValue([])
    })

    test('should not call getPaymentSchedule', async () => {
      await processPaymentSchedules()
      expect(getPaymentSchedule).not.toHaveBeenCalled()
    })

    test('should not call validatePaymentSchedule', async () => {
      await processPaymentSchedules()
      expect(validatePaymentSchedule).not.toHaveBeenCalled()
    })

    test('should not call sendPaymentSchedule', async () => {
      await processPaymentSchedules()
      expect(sendPaymentSchedule).not.toHaveBeenCalled()
    })

    test('should not call updateScheduleByScheduleId', async () => {
      await processPaymentSchedules()
      expect(updateScheduleByScheduleId).not.toHaveBeenCalled()
    })

    test('should return undefined', async () => {
      const result = await processPaymentSchedules()
      expect(result).toBeUndefined()
    })
  })

  describe('when 1 issue within multiple records', () => {
    beforeEach(async () => {
      schedulePendingPaymentSchedules.mockResolvedValue([retrievedPaymentSchedule, retrievedPaymentSchedule, retrievedPaymentSchedule])
    })

    describe('when getPaymentSchedule throws', () => {
      beforeEach(async () => {
        getPaymentSchedule.mockResolvedValueOnce(schedule).mockRejectedValueOnce(new Error('Processing issue')).mockResolvedValueOnce(schedule)
      })

      test('should call getPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(getPaymentSchedule).toHaveBeenCalled()
      })

      test('should call getPaymentSchedule 3 times', async () => {
        await processPaymentSchedules()
        expect(getPaymentSchedule).toHaveBeenCalledTimes(3)
      })

      test('should call getPaymentSchedule with each schedulePendingPaymentSchedules().paymentRequestId and schedulePendingPaymentSchedules().scheduleId', async () => {
        await processPaymentSchedules()

        expect(getPaymentSchedule).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].paymentRequestId, (await schedulePendingPaymentSchedules())[0].scheduleId)
        expect(getPaymentSchedule).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[1].paymentRequestId, (await schedulePendingPaymentSchedules())[1].scheduleId)
        expect(getPaymentSchedule).toHaveBeenNthCalledWith(3, (await schedulePendingPaymentSchedules())[2].paymentRequestId, (await schedulePendingPaymentSchedules())[2].scheduleId)
      })

      test('should call validatePaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(validatePaymentSchedule).toHaveBeenCalled()
      })

      test('should call validatePaymentSchedule 2 times', async () => {
        await processPaymentSchedules()
        expect(validatePaymentSchedule).toHaveBeenCalledTimes(2)
      })

      test('should call validatePaymentSchedule with each sucessful getPaymentSchedule()', async () => {
        await processPaymentSchedules()

        expect(validatePaymentSchedule).toHaveBeenNthCalledWith(1, await getPaymentSchedule())
        expect(validatePaymentSchedule).toHaveBeenNthCalledWith(2, await getPaymentSchedule())
      })

      test('should call sendPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalled()
      })

      test('should call sendPaymentSchedule 2 times', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalledTimes(2)
      })

      test('should call sendPaymentSchedule with each successful getPaymentSchedule()', async () => {
        await processPaymentSchedules()

        expect(sendPaymentSchedule).toHaveBeenNthCalledWith(1, await getPaymentSchedule())
        expect(sendPaymentSchedule).toHaveBeenNthCalledWith(2, await getPaymentSchedule())
      })

      test('should call updateScheduleByScheduleId', async () => {
        await processPaymentSchedules()
        expect(updateScheduleByScheduleId).toHaveBeenCalled()
      })

      test('should call updateScheduleByScheduleId 2 times', async () => {
        await processPaymentSchedules()
        expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(2)
      })

      test('should call updateScheduleByScheduleId with each successful schedulePendingPaymentSchedules.scheduleId', async () => {
        await processPaymentSchedules()

        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[0].scheduleId)
      })

      test('should return undefined', async () => {
        const result = await processPaymentSchedules()
        expect(result).toBeUndefined()
      })
    })

    describe('when sendPaymentSchedule throws', () => {
      beforeEach(async () => {
        sendPaymentSchedule.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('Sending issue')).mockResolvedValueOnce(undefined)
      })

      test('should call getPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(getPaymentSchedule).toHaveBeenCalled()
      })

      test('should call getPaymentSchedule 3 times', async () => {
        await processPaymentSchedules()
        expect(getPaymentSchedule).toHaveBeenCalledTimes(3)
      })

      test('should call getPaymentSchedule with each schedulePendingPaymentSchedules().paymentRequestId and schedulePendingPaymentSchedules().scheduleId', async () => {
        await processPaymentSchedules()

        expect(getPaymentSchedule).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].paymentRequestId, (await schedulePendingPaymentSchedules())[0].scheduleId)
        expect(getPaymentSchedule).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[1].paymentRequestId, (await schedulePendingPaymentSchedules())[1].scheduleId)
        expect(getPaymentSchedule).toHaveBeenNthCalledWith(3, (await schedulePendingPaymentSchedules())[2].paymentRequestId, (await schedulePendingPaymentSchedules())[2].scheduleId)
      })

      test('should call validatePaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(validatePaymentSchedule).toHaveBeenCalled()
      })

      test('should call validatePaymentSchedule 3 times', async () => {
        await processPaymentSchedules()
        expect(validatePaymentSchedule).toHaveBeenCalledTimes(3)
      })

      test('should call validatePaymentSchedule with each getPaymentSchedule()', async () => {
        await processPaymentSchedules()

        expect(validatePaymentSchedule).toHaveBeenNthCalledWith(1, await getPaymentSchedule())
        expect(validatePaymentSchedule).toHaveBeenNthCalledWith(2, await getPaymentSchedule())
        expect(validatePaymentSchedule).toHaveBeenNthCalledWith(3, await getPaymentSchedule())
      })

      test('should call sendPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalled()
      })

      test('should call sendPaymentSchedule 3 times', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalledTimes(3)
      })

      test('should call sendPaymentSchedule with each getPaymentSchedule()', async () => {
        await processPaymentSchedules()

        expect(sendPaymentSchedule).toHaveBeenNthCalledWith(1, await getPaymentSchedule())
        expect(sendPaymentSchedule).toHaveBeenNthCalledWith(2, await getPaymentSchedule())
        expect(sendPaymentSchedule).toHaveBeenNthCalledWith(3, await getPaymentSchedule())
      })

      test('should call updateScheduleByScheduleId', async () => {
        await processPaymentSchedules()
        expect(updateScheduleByScheduleId).toHaveBeenCalled()
      })

      test('should call updateScheduleByScheduleId 2 times', async () => {
        await processPaymentSchedules()
        expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(2)
      })

      test('should call updateScheduleByScheduleId with each successful schedulePendingPaymentSchedules.scheduleId', async () => {
        await processPaymentSchedules()

        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[0].scheduleId)
      })

      test('should return undefined', async () => {
        const result = await processPaymentSchedules()
        expect(result).toBeUndefined()
      })
    })

    describe('when updateScheduleByScheduleId throws', () => {
      beforeEach(async () => {
        updateScheduleByScheduleId.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('Updating issue')).mockResolvedValueOnce(undefined)
      })

      test('should call getPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(getPaymentSchedule).toHaveBeenCalled()
      })

      test('should call getPaymentSchedule 3 times', async () => {
        await processPaymentSchedules()
        expect(getPaymentSchedule).toHaveBeenCalledTimes(3)
      })

      test('should call getPaymentSchedule with each schedulePendingPaymentSchedules().paymentRequestId and schedulePendingPaymentSchedules().scheduleId', async () => {
        await processPaymentSchedules()

        expect(getPaymentSchedule).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].paymentRequestId, (await schedulePendingPaymentSchedules())[0].scheduleId)
        expect(getPaymentSchedule).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[1].paymentRequestId, (await schedulePendingPaymentSchedules())[1].scheduleId)
        expect(getPaymentSchedule).toHaveBeenNthCalledWith(3, (await schedulePendingPaymentSchedules())[2].paymentRequestId, (await schedulePendingPaymentSchedules())[2].scheduleId)
      })

      test('should call validatePaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(validatePaymentSchedule).toHaveBeenCalled()
      })

      test('should call validatePaymentSchedule 3 times', async () => {
        await processPaymentSchedules()
        expect(validatePaymentSchedule).toHaveBeenCalledTimes(3)
      })

      test('should call validatePaymentSchedule with each getPaymentSchedule()', async () => {
        await processPaymentSchedules()

        expect(validatePaymentSchedule).toHaveBeenNthCalledWith(1, await getPaymentSchedule())
        expect(validatePaymentSchedule).toHaveBeenNthCalledWith(2, await getPaymentSchedule())
        expect(validatePaymentSchedule).toHaveBeenNthCalledWith(3, await getPaymentSchedule())
      })

      test('should call sendPaymentSchedule', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalled()
      })

      test('should call sendPaymentSchedule 3 times', async () => {
        await processPaymentSchedules()
        expect(sendPaymentSchedule).toHaveBeenCalledTimes(3)
      })

      test('should call sendPaymentSchedule with each getPaymentSchedule()', async () => {
        await processPaymentSchedules()

        expect(sendPaymentSchedule).toHaveBeenNthCalledWith(1, await getPaymentSchedule())
        expect(sendPaymentSchedule).toHaveBeenNthCalledWith(2, await getPaymentSchedule())
        expect(sendPaymentSchedule).toHaveBeenNthCalledWith(3, await getPaymentSchedule())
      })

      test('should call updateScheduleByScheduleId', async () => {
        await processPaymentSchedules()
        expect(updateScheduleByScheduleId).toHaveBeenCalled()
      })

      test('should call updateScheduleByScheduleId 3 times', async () => {
        await processPaymentSchedules()
        expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(3)
      })

      test('should call updateScheduleByScheduleId with each schedulePendingPaymentSchedules.scheduleId', async () => {
        await processPaymentSchedules()

        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(3, (await schedulePendingPaymentSchedules())[0].scheduleId)
      })

      test('should return undefined', async () => {
        const result = await processPaymentSchedules()
        expect(result).toBeUndefined()
      })
    })
  })
})
