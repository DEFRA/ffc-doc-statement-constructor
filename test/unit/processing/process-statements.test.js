jest.mock('../../../app/processing/schedule')
const { schedulePendingSettlements } = require('../../../app/processing/schedule')

jest.mock('../../../app/processing/statement')
const { getStatement, sendStatement, validateStatement } = require('../../../app/processing/statement')

jest.mock('../../../app/processing/update-schedule-by-schedule-id')
const updateScheduleByScheduleId = require('../../../app/processing/update-schedule-by-schedule-id')

const processStatements = require('../../../app/processing/process-statements')

let retrievedSchedule
let statement

describe('process statements', () => {
  beforeEach(async () => {
    const schedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').STATEMENT))
    retrievedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }

    statement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-statement')))

    schedulePendingSettlements.mockResolvedValue([retrievedSchedule])
    validateStatement.mockReturnValue(true)
    sendStatement.mockResolvedValue(undefined)
    updateScheduleByScheduleId.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call schedulePendingSettlements', async () => {
    await processStatements()
    expect(schedulePendingSettlements).toHaveBeenCalled()
  })

  test('should call schedulePendingSettlements once', async () => {
    await processStatements()
    expect(schedulePendingSettlements).toHaveBeenCalledTimes(1)
  })

  test('should throw error when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processStatements()
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schedulePendingSettlements throws Error', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processStatements()
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Processing issue" when schedulePendingSettlements throws error "Processing issue"', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processStatements()
    }

    expect(wrapper).rejects.toThrow(/^Processing issue$/)
  })

  describe('when schedulePendingSettlements returns 1 record', () => {
    beforeEach(async () => {
      schedulePendingSettlements.mockResolvedValue([retrievedSchedule])
      getStatement.mockResolvedValue(statement)
    })

    test('should call getStatement', async () => {
      await processStatements()
      expect(getStatement).toHaveBeenCalled()
    })

    test('should call getStatement once', async () => {
      await processStatements()
      expect(getStatement).toHaveBeenCalledTimes(1)
    })

    test('should call getStatement with schedulePendingSettlements().settlementId and schedulePendingSettlements().scheduleId', async () => {
      await processStatements()
      expect(getStatement).toHaveBeenCalledWith((await schedulePendingSettlements())[0].settlementId, (await schedulePendingSettlements())[0].scheduleId)
    })

    test('should call validateStatement', async () => {
      await processStatements()
      expect(validateStatement).toHaveBeenCalled()
    })

    test('should call validateStatement once', async () => {
      await processStatements()
      expect(validateStatement).toHaveBeenCalledTimes(1)
    })

    test('should call validateStatement with getStatement()', async () => {
      await processStatements()
      expect(validateStatement).toHaveBeenCalledWith(await getStatement())
    })

    describe('when validateStatement returns true', () => {
      beforeEach(() => {
        validateStatement.mockReturnValue(true)
      })

      test('should call sendStatement', async () => {
        await processStatements()
        expect(sendStatement).toHaveBeenCalled()
      })

      test('should call sendStatement once', async () => {
        await processStatements()
        expect(sendStatement).toHaveBeenCalledTimes(1)
      })

      test('should call sendStatement with getStatement()', async () => {
        await processStatements()
        expect(sendStatement).toHaveBeenCalledWith(await getStatement())
      })
    })

    describe('when validateStatement returns false', () => {
      beforeEach(() => {
        validateStatement.mockReturnValue(false)
      })

      test('should not call sendStatement', async () => {
        await processStatements()
        expect(sendStatement).not.toHaveBeenCalled()
      })
    })

    test('should call updateScheduleByScheduleId', async () => {
      await processStatements()
      expect(updateScheduleByScheduleId).toHaveBeenCalled()
    })

    test('should call updateScheduleByScheduleId once', async () => {
      await processStatements()
      expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(1)
    })

    test('should call updateScheduleByScheduleId with schedulePendingSettlements().scheduleId', async () => {
      await processStatements()
      expect(updateScheduleByScheduleId).toHaveBeenCalledWith((await schedulePendingSettlements())[0].scheduleId)
    })

    test('should return undefined', async () => {
      const result = await processStatements()
      expect(result).toBeUndefined()
    })
  })

  describe('when schedulePendingSettlements returns 2 records', () => {
    beforeEach(async () => {
      schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule])
      getStatement.mockResolvedValueOnce(statement).mockResolvedValueOnce(statement)
    })

    test('should call getStatement', async () => {
      await processStatements()
      expect(getStatement).toHaveBeenCalled()
    })

    test('should call getStatement twice', async () => {
      await processStatements()
      expect(getStatement).toHaveBeenCalledTimes(2)
    })

    test('should call getStatement with each schedulePendingSettlements().settlementId and schedulePendingSettlements().scheduleId', async () => {
      await processStatements()

      expect(getStatement).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].settlementId, (await schedulePendingSettlements())[0].scheduleId)
      expect(getStatement).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].settlementId, (await schedulePendingSettlements())[1].scheduleId)
    })

    test('should call validateStatement', async () => {
      await processStatements()
      expect(validateStatement).toHaveBeenCalled()
    })

    test('should call validateStatement twice', async () => {
      await processStatements()
      expect(validateStatement).toHaveBeenCalledTimes(2)
    })

    test('should call validateStatement with each getStatement()', async () => {
      await processStatements()

      expect(validateStatement).toHaveBeenNthCalledWith(1, await getStatement())
      expect(validateStatement).toHaveBeenNthCalledWith(2, await getStatement())
    })

    describe('when validateStatement returns true', () => {
      beforeEach(() => {
        validateStatement.mockReturnValueOnce(true).mockReturnValueOnce(true)
      })

      test('should call sendStatement', async () => {
        await processStatements()
        expect(sendStatement).toHaveBeenCalled()
      })

      test('should call sendStatement twice', async () => {
        await processStatements()
        expect(sendStatement).toHaveBeenCalledTimes(2)
      })

      test('should call sendStatement with each getStatement()', async () => {
        await processStatements()

        expect(sendStatement).toHaveBeenNthCalledWith(1, await getStatement())
        expect(sendStatement).toHaveBeenNthCalledWith(2, await getStatement())
      })
    })

    describe('when validateStatement returns false', () => {
      beforeEach(() => {
        validateStatement.mockReturnValueOnce(false).mockReturnValueOnce(false)
      })

      test('should not call sendStatement', async () => {
        await processStatements()
        expect(sendStatement).not.toHaveBeenCalled()
      })
    })

    test('should call updateScheduleByScheduleId', async () => {
      await processStatements()
      expect(updateScheduleByScheduleId).toHaveBeenCalled()
    })

    test('should call updateScheduleByScheduleId twice', async () => {
      await processStatements()
      expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(2)
    })

    test('should call updateScheduleByScheduleId with each schedulePendingSettlements().scheduleId', async () => {
      await processStatements()

      expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].scheduleId)
      expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].scheduleId)
    })

    test('should return undefined', async () => {
      const result = await processStatements()
      expect(result).toBeUndefined()
    })
  })

  describe('when schedulePendingSettlements returns 0 records', () => {
    beforeEach(async () => {
      schedulePendingSettlements.mockResolvedValue([])
    })

    test('should not call getStatement', async () => {
      await processStatements()
      expect(getStatement).not.toHaveBeenCalled()
    })

    test('should not call validateStatement', async () => {
      await processStatements()
      expect(validateStatement).not.toHaveBeenCalled()
    })

    test('should not call sendStatement', async () => {
      await processStatements()
      expect(sendStatement).not.toHaveBeenCalled()
    })

    test('should not call updateScheduleByScheduleId', async () => {
      await processStatements()
      expect(updateScheduleByScheduleId).not.toHaveBeenCalled()
    })

    test('should return undefined', async () => {
      const result = await processStatements()
      expect(result).toBeUndefined()
    })
  })

  describe('when 1 issue within multiple records', () => {
    beforeEach(async () => {
      schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule, retrievedSchedule])
    })

    describe('when getStatement throws', () => {
      beforeEach(async () => {
        getStatement.mockResolvedValueOnce(statement).mockRejectedValueOnce(new Error('Processing issue')).mockResolvedValueOnce(statement)
      })

      test('should call getStatement', async () => {
        await processStatements()
        expect(getStatement).toHaveBeenCalled()
      })

      test('should call getStatement 3 times', async () => {
        await processStatements()
        expect(getStatement).toHaveBeenCalledTimes(3)
      })

      test('should call getStatement with each schedulePendingSettlements().settlementId and schedulePendingSettlements().scheduleId', async () => {
        await processStatements()

        expect(getStatement).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].settlementId, (await schedulePendingSettlements())[0].scheduleId)
        expect(getStatement).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].settlementId, (await schedulePendingSettlements())[1].scheduleId)
        expect(getStatement).toHaveBeenNthCalledWith(3, (await schedulePendingSettlements())[2].settlementId, (await schedulePendingSettlements())[2].scheduleId)
      })

      test('should call validateStatement', async () => {
        await processStatements()
        expect(validateStatement).toHaveBeenCalled()
      })

      test('should call validateStatement 2 times', async () => {
        await processStatements()
        expect(validateStatement).toHaveBeenCalledTimes(2)
      })

      test('should call validateStatement with each sucessful getStatement()', async () => {
        await processStatements()

        expect(validateStatement).toHaveBeenNthCalledWith(1, await getStatement())
        expect(validateStatement).toHaveBeenNthCalledWith(2, await getStatement())
      })

      test('should call sendStatement', async () => {
        await processStatements()
        expect(sendStatement).toHaveBeenCalled()
      })

      test('should call sendStatement 2 times', async () => {
        await processStatements()
        expect(sendStatement).toHaveBeenCalledTimes(2)
      })

      test('should call sendStatement with each successful getStatement()', async () => {
        await processStatements()

        expect(sendStatement).toHaveBeenNthCalledWith(1, await getStatement())
        expect(sendStatement).toHaveBeenNthCalledWith(2, await getStatement())
      })

      test('should call updateScheduleByScheduleId', async () => {
        await processStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalled()
      })

      test('should call updateScheduleByScheduleId 2 times', async () => {
        await processStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(2)
      })

      test('should call updateScheduleByScheduleId with each successful schedulePendingSettlements.scheduleId', async () => {
        await processStatements()

        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[0].scheduleId)
      })

      test('should return undefined', async () => {
        const result = await processStatements()
        expect(result).toBeUndefined()
      })
    })

    describe('when sendStatement throws', () => {
      beforeEach(async () => {
        sendStatement.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('Sending issue')).mockResolvedValueOnce(undefined)
      })

      test('should call getStatement', async () => {
        await processStatements()
        expect(getStatement).toHaveBeenCalled()
      })

      test('should call getStatement 3 times', async () => {
        await processStatements()
        expect(getStatement).toHaveBeenCalledTimes(3)
      })

      test('should call getStatement with each schedulePendingSettlements().settlementId and schedulePendingSettlements().scheduleId', async () => {
        await processStatements()

        expect(getStatement).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].settlementId, (await schedulePendingSettlements())[0].scheduleId)
        expect(getStatement).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].settlementId, (await schedulePendingSettlements())[1].scheduleId)
        expect(getStatement).toHaveBeenNthCalledWith(3, (await schedulePendingSettlements())[2].settlementId, (await schedulePendingSettlements())[2].scheduleId)
      })

      test('should call validateStatement', async () => {
        await processStatements()
        expect(validateStatement).toHaveBeenCalled()
      })

      test('should call validateStatement 3 times', async () => {
        await processStatements()
        expect(validateStatement).toHaveBeenCalledTimes(3)
      })

      test('should call validateStatement with each getStatement()', async () => {
        await processStatements()

        expect(validateStatement).toHaveBeenNthCalledWith(1, await getStatement())
        expect(validateStatement).toHaveBeenNthCalledWith(2, await getStatement())
        expect(validateStatement).toHaveBeenNthCalledWith(3, await getStatement())
      })

      test('should call sendStatement', async () => {
        await processStatements()
        expect(sendStatement).toHaveBeenCalled()
      })

      test('should call sendStatement 3 times', async () => {
        await processStatements()
        expect(sendStatement).toHaveBeenCalledTimes(3)
      })

      test('should call sendStatement with each getStatement()', async () => {
        await processStatements()

        expect(sendStatement).toHaveBeenNthCalledWith(1, await getStatement())
        expect(sendStatement).toHaveBeenNthCalledWith(2, await getStatement())
        expect(sendStatement).toHaveBeenNthCalledWith(3, await getStatement())
      })

      test('should call updateScheduleByScheduleId', async () => {
        await processStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalled()
      })

      test('should call updateScheduleByScheduleId 2 times', async () => {
        await processStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(2)
      })

      test('should call updateScheduleByScheduleId with each successful schedulePendingSettlements.scheduleId', async () => {
        await processStatements()

        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[0].scheduleId)
      })

      test('should return undefined', async () => {
        const result = await processStatements()
        expect(result).toBeUndefined()
      })
    })

    describe('when updateScheduleByScheduleId throws', () => {
      beforeEach(async () => {
        updateScheduleByScheduleId.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('Updating issue')).mockResolvedValueOnce(undefined)
      })

      test('should call getStatement', async () => {
        await processStatements()
        expect(getStatement).toHaveBeenCalled()
      })

      test('should call getStatement 3 times', async () => {
        await processStatements()
        expect(getStatement).toHaveBeenCalledTimes(3)
      })

      test('should call getStatement with each schedulePendingSettlements().settlementId and schedulePendingSettlements().scheduleId', async () => {
        await processStatements()

        expect(getStatement).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].settlementId, (await schedulePendingSettlements())[0].scheduleId)
        expect(getStatement).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].settlementId, (await schedulePendingSettlements())[1].scheduleId)
        expect(getStatement).toHaveBeenNthCalledWith(3, (await schedulePendingSettlements())[2].settlementId, (await schedulePendingSettlements())[2].scheduleId)
      })

      test('should call validateStatement', async () => {
        await processStatements()
        expect(validateStatement).toHaveBeenCalled()
      })

      test('should call validateStatement 3 times', async () => {
        await processStatements()
        expect(validateStatement).toHaveBeenCalledTimes(3)
      })

      test('should call validateStatement with each getStatement()', async () => {
        await processStatements()

        expect(validateStatement).toHaveBeenNthCalledWith(1, await getStatement())
        expect(validateStatement).toHaveBeenNthCalledWith(2, await getStatement())
        expect(validateStatement).toHaveBeenNthCalledWith(3, await getStatement())
      })

      test('should call sendStatement', async () => {
        await processStatements()
        expect(sendStatement).toHaveBeenCalled()
      })

      test('should call sendStatement 3 times', async () => {
        await processStatements()
        expect(sendStatement).toHaveBeenCalledTimes(3)
      })

      test('should call sendStatement with each getStatement()', async () => {
        await processStatements()

        expect(sendStatement).toHaveBeenNthCalledWith(1, await getStatement())
        expect(sendStatement).toHaveBeenNthCalledWith(2, await getStatement())
        expect(sendStatement).toHaveBeenNthCalledWith(3, await getStatement())
      })

      test('should call updateScheduleByScheduleId', async () => {
        await processStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalled()
      })

      test('should call updateScheduleByScheduleId 3 times', async () => {
        await processStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(3)
      })

      test('should call updateScheduleByScheduleId with each schedulePendingSettlements.scheduleId', async () => {
        await processStatements()

        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(3, (await schedulePendingSettlements())[0].scheduleId)
      })

      test('should return undefined', async () => {
        const result = await processStatements()
        expect(result).toBeUndefined()
      })
    })
  })
})
