jest.mock('../../../app/processing/schedule')
const { schedulePendingSettlements } = require('../../../app/processing/schedule')

jest.mock('../../../app/processing/sfi-23-advanced-statement')
const { getSfi23AdvancedStatement, sendSfi23AdvancedStatement, validateSfi23AdvancedStatement } = require('../../../app/processing/sfi-23-advanced-statement')

jest.mock('../../../app/processing/update-schedule-by-schedule-id')
const updateScheduleByScheduleId = require('../../../app/processing/update-schedule-by-schedule-id')

const processSfi23AdvancedStatements = require('../../../app/processing/process-sfi-23-advanced-statements')

let retrievedSchedule
let sfi23AdvancedStatement

describe('process statements', () => {
  beforeEach(async () => {
    const schedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').STATEMENT))
    retrievedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }

    sfi23AdvancedStatement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-sfi-23-advanced-statement')))

    schedulePendingSettlements.mockResolvedValue([retrievedSchedule])
    validateSfi23AdvancedStatement.mockReturnValue(true)
    sendSfi23AdvancedStatement.mockResolvedValue(undefined)
    updateScheduleByScheduleId.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call schedulePendingSettlements', async () => {
    await processSfi23AdvancedStatements()
    expect(schedulePendingSettlements).toHaveBeenCalled()
  })

  test('should call schedulePendingSettlements once', async () => {
    await processSfi23AdvancedStatements()
    expect(schedulePendingSettlements).toHaveBeenCalledTimes(1)
  })

  test('should throw error when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processSfi23AdvancedStatements()
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schedulePendingSettlements throws Error', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processSfi23AdvancedStatements()
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Processing issue" when schedulePendingSettlements throws error "Processing issue"', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processSfi23AdvancedStatements()
    }

    expect(wrapper).rejects.toThrow(/^Processing issue$/)
  })

  describe('when schedulePendingSettlements returns 1 record', () => {
    beforeEach(async () => {
      schedulePendingSettlements.mockResolvedValue([retrievedSchedule])
      getSfi23AdvancedStatement.mockResolvedValue(sfi23AdvancedStatement)
    })

    test('should call getSfi23AdvancedStatement', async () => {
      await processSfi23AdvancedStatements()
      expect(getSfi23AdvancedStatement).toHaveBeenCalled()
    })

    test('should call getSfi23AdvancedStatement once', async () => {
      await processSfi23AdvancedStatements()
      expect(getSfi23AdvancedStatement).toHaveBeenCalledTimes(1)
    })

    test('should call getSfi23AdvancedStatement with schedulePendingSettlements().settlementId and schedulePendingSettlements().scheduleId', async () => {
      await processSfi23AdvancedStatements()
      expect(getSfi23AdvancedStatement).toHaveBeenCalledWith((await schedulePendingSettlements())[0].settlementId, (await schedulePendingSettlements())[0].scheduleId)
    })

    test('should call validateSfi23AdvancedStatement', async () => {
      await processSfi23AdvancedStatements()
      expect(validateSfi23AdvancedStatement).toHaveBeenCalled()
    })

    test('should call validateSfi23AdvancedStatement once', async () => {
      await processSfi23AdvancedStatements()
      expect(validateSfi23AdvancedStatement).toHaveBeenCalledTimes(1)
    })

    test('should call validateSfi23AdvancedStatement with getSfi23AdvancedStatement()', async () => {
      await processSfi23AdvancedStatements()
      expect(validateSfi23AdvancedStatement).toHaveBeenCalledWith(await getSfi23AdvancedStatement())
    })

    describe('when validateSfi23AdvancedStatement returns true', () => {
      beforeEach(() => {
        validateSfi23AdvancedStatement.mockReturnValue(true)
      })

      test('should call sendSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).toHaveBeenCalled()
      })

      test('should call sendSfi23AdvancedStatement once', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).toHaveBeenCalledTimes(1)
      })

      test('should call sendSfi23AdvancedStatement with getSfi23AdvancedStatement()', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).toHaveBeenCalledWith(await getSfi23AdvancedStatement())
      })
    })

    describe('when validateSfi23AdvancedStatement returns false', () => {
      beforeEach(() => {
        validateSfi23AdvancedStatement.mockReturnValue(false)
      })

      test('should not call sendSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).not.toHaveBeenCalled()
      })
    })

    test('should call updateScheduleByScheduleId', async () => {
      await processSfi23AdvancedStatements()
      expect(updateScheduleByScheduleId).toHaveBeenCalled()
    })

    test('should call updateScheduleByScheduleId once', async () => {
      await processSfi23AdvancedStatements()
      expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(1)
    })

    test('should call updateScheduleByScheduleId with schedulePendingSettlements().scheduleId', async () => {
      await processSfi23AdvancedStatements()
      expect(updateScheduleByScheduleId).toHaveBeenCalledWith((await schedulePendingSettlements())[0].scheduleId)
    })

    test('should return undefined', async () => {
      const result = await processSfi23AdvancedStatements()
      expect(result).toBeUndefined()
    })
  })

  describe('when schedulePendingSettlements returns 2 records', () => {
    beforeEach(async () => {
      schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule])
      getSfi23AdvancedStatement.mockResolvedValueOnce(sfi23AdvancedStatement).mockResolvedValueOnce(sfi23AdvancedStatement)
    })

    test('should call getSfi23AdvancedStatement', async () => {
      await processSfi23AdvancedStatements()
      expect(getSfi23AdvancedStatement).toHaveBeenCalled()
    })

    test('should call getSfi23AdvancedStatement twice', async () => {
      await processSfi23AdvancedStatements()
      expect(getSfi23AdvancedStatement).toHaveBeenCalledTimes(2)
    })

    test('should call getSfi23AdvancedStatement with each schedulePendingSettlements().settlementId and schedulePendingSettlements().scheduleId', async () => {
      await processSfi23AdvancedStatements()

      expect(getSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].settlementId, (await schedulePendingSettlements())[0].scheduleId)
      expect(getSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].settlementId, (await schedulePendingSettlements())[1].scheduleId)
    })

    test('should call validateSfi23AdvancedStatement', async () => {
      await processSfi23AdvancedStatements()
      expect(validateSfi23AdvancedStatement).toHaveBeenCalled()
    })

    test('should call validateSfi23AdvancedStatement twice', async () => {
      await processSfi23AdvancedStatements()
      expect(validateSfi23AdvancedStatement).toHaveBeenCalledTimes(2)
    })

    test('should call validateSfi23AdvancedStatement with each getSfi23AdvancedStatement()', async () => {
      await processSfi23AdvancedStatements()

      expect(validateSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, await getSfi23AdvancedStatement())
      expect(validateSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, await getSfi23AdvancedStatement())
    })

    describe('when validateSfi23AdvancedStatement returns true', () => {
      beforeEach(() => {
        validateSfi23AdvancedStatement.mockReturnValueOnce(true).mockReturnValueOnce(true)
      })

      test('should call sendSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).toHaveBeenCalled()
      })

      test('should call sendSfi23AdvancedStatement twice', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).toHaveBeenCalledTimes(2)
      })

      test('should call sendSfi23AdvancedStatement with each getSfi23AdvancedStatement()', async () => {
        await processSfi23AdvancedStatements()

        expect(sendSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, await getSfi23AdvancedStatement())
        expect(sendSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, await getSfi23AdvancedStatement())
      })
    })

    describe('when validateSfi23AdvancedStatement returns false', () => {
      beforeEach(() => {
        validateSfi23AdvancedStatement.mockReturnValueOnce(false).mockReturnValueOnce(false)
      })

      test('should not call sendSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).not.toHaveBeenCalled()
      })
    })

    test('should call updateScheduleByScheduleId', async () => {
      await processSfi23AdvancedStatements()
      expect(updateScheduleByScheduleId).toHaveBeenCalled()
    })

    test('should call updateScheduleByScheduleId twice', async () => {
      await processSfi23AdvancedStatements()
      expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(2)
    })

    test('should call updateScheduleByScheduleId with each schedulePendingSettlements().scheduleId', async () => {
      await processSfi23AdvancedStatements()

      expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].scheduleId)
      expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].scheduleId)
    })

    test('should return undefined', async () => {
      const result = await processSfi23AdvancedStatements()
      expect(result).toBeUndefined()
    })
  })

  describe('when schedulePendingSettlements returns 0 records', () => {
    beforeEach(async () => {
      schedulePendingSettlements.mockResolvedValue([])
    })

    test('should not call getSfi23AdvancedStatement', async () => {
      await processSfi23AdvancedStatements()
      expect(getSfi23AdvancedStatement).not.toHaveBeenCalled()
    })

    test('should not call validateSfi23AdvancedStatement', async () => {
      await processSfi23AdvancedStatements()
      expect(validateSfi23AdvancedStatement).not.toHaveBeenCalled()
    })

    test('should not call sendSfi23AdvancedStatement', async () => {
      await processSfi23AdvancedStatements()
      expect(sendSfi23AdvancedStatement).not.toHaveBeenCalled()
    })

    test('should not call updateScheduleByScheduleId', async () => {
      await processSfi23AdvancedStatements()
      expect(updateScheduleByScheduleId).not.toHaveBeenCalled()
    })

    test('should return undefined', async () => {
      const result = await processSfi23AdvancedStatements()
      expect(result).toBeUndefined()
    })
  })

  describe('when 1 issue within multiple records', () => {
    beforeEach(async () => {
      schedulePendingSettlements.mockResolvedValue([retrievedSchedule, retrievedSchedule, retrievedSchedule])
    })

    describe('when getSfi23AdvancedStatement throws', () => {
      beforeEach(async () => {
        getSfi23AdvancedStatement.mockResolvedValueOnce(sfi23AdvancedStatement).mockRejectedValueOnce(new Error('Processing issue')).mockResolvedValueOnce(sfi23AdvancedStatement)
      })

      test('should call getSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(getSfi23AdvancedStatement).toHaveBeenCalled()
      })

      test('should call getSfi23AdvancedStatement 3 times', async () => {
        await processSfi23AdvancedStatements()
        expect(getSfi23AdvancedStatement).toHaveBeenCalledTimes(3)
      })

      test('should call getSfi23AdvancedStatement with each schedulePendingSettlements().settlementId and schedulePendingSettlements().scheduleId', async () => {
        await processSfi23AdvancedStatements()

        expect(getSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].settlementId, (await schedulePendingSettlements())[0].scheduleId)
        expect(getSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].settlementId, (await schedulePendingSettlements())[1].scheduleId)
        expect(getSfi23AdvancedStatement).toHaveBeenNthCalledWith(3, (await schedulePendingSettlements())[2].settlementId, (await schedulePendingSettlements())[2].scheduleId)
      })

      test('should call validateSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(validateSfi23AdvancedStatement).toHaveBeenCalled()
      })

      test('should call validateSfi23AdvancedStatement 2 times', async () => {
        await processSfi23AdvancedStatements()
        expect(validateSfi23AdvancedStatement).toHaveBeenCalledTimes(2)
      })

      test('should call validateSfi23AdvancedStatement with each sucessful getSfi23AdvancedStatement()', async () => {
        await processSfi23AdvancedStatements()

        expect(validateSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, await getSfi23AdvancedStatement())
        expect(validateSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, await getSfi23AdvancedStatement())
      })

      test('should call sendSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).toHaveBeenCalled()
      })

      test('should call sendSfi23AdvancedStatement 2 times', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).toHaveBeenCalledTimes(2)
      })

      test('should call sendSfi23AdvancedStatement with each successful getSfi23AdvancedStatement()', async () => {
        await processSfi23AdvancedStatements()

        expect(sendSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, await getSfi23AdvancedStatement())
        expect(sendSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, await getSfi23AdvancedStatement())
      })

      test('should call updateScheduleByScheduleId', async () => {
        await processSfi23AdvancedStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalled()
      })

      test('should call updateScheduleByScheduleId 2 times', async () => {
        await processSfi23AdvancedStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(2)
      })

      test('should call updateScheduleByScheduleId with each successful schedulePendingSettlements.scheduleId', async () => {
        await processSfi23AdvancedStatements()

        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[0].scheduleId)
      })

      test('should return undefined', async () => {
        const result = await processSfi23AdvancedStatements()
        expect(result).toBeUndefined()
      })
    })

    describe('when sendSfi23AdvancedStatement throws', () => {
      beforeEach(async () => {
        sendSfi23AdvancedStatement.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('Sending issue')).mockResolvedValueOnce(undefined)
      })

      test('should call getSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(getSfi23AdvancedStatement).toHaveBeenCalled()
      })

      test('should call getSfi23AdvancedStatement 3 times', async () => {
        await processSfi23AdvancedStatements()
        expect(getSfi23AdvancedStatement).toHaveBeenCalledTimes(3)
      })

      test('should call getSfi23AdvancedStatement with each schedulePendingSettlements().settlementId and schedulePendingSettlements().scheduleId', async () => {
        await processSfi23AdvancedStatements()

        expect(getSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].settlementId, (await schedulePendingSettlements())[0].scheduleId)
        expect(getSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].settlementId, (await schedulePendingSettlements())[1].scheduleId)
        expect(getSfi23AdvancedStatement).toHaveBeenNthCalledWith(3, (await schedulePendingSettlements())[2].settlementId, (await schedulePendingSettlements())[2].scheduleId)
      })

      test('should call validateSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(validateSfi23AdvancedStatement).toHaveBeenCalled()
      })

      test('should call validateSfi23AdvancedStatement 3 times', async () => {
        await processSfi23AdvancedStatements()
        expect(validateSfi23AdvancedStatement).toHaveBeenCalledTimes(3)
      })

      test('should call validateSfi23AdvancedStatement with each getSfi23AdvancedStatement()', async () => {
        await processSfi23AdvancedStatements()

        expect(validateSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, await getSfi23AdvancedStatement())
        expect(validateSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, await getSfi23AdvancedStatement())
        expect(validateSfi23AdvancedStatement).toHaveBeenNthCalledWith(3, await getSfi23AdvancedStatement())
      })

      test('should call sendSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).toHaveBeenCalled()
      })

      test('should call sendSfi23AdvancedStatement 3 times', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).toHaveBeenCalledTimes(3)
      })

      test('should call sendSfi23AdvancedStatement with each getSfi23AdvancedStatement()', async () => {
        await processSfi23AdvancedStatements()

        expect(sendSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, await getSfi23AdvancedStatement())
        expect(sendSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, await getSfi23AdvancedStatement())
        expect(sendSfi23AdvancedStatement).toHaveBeenNthCalledWith(3, await getSfi23AdvancedStatement())
      })

      test('should call updateScheduleByScheduleId', async () => {
        await processSfi23AdvancedStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalled()
      })

      test('should call updateScheduleByScheduleId 2 times', async () => {
        await processSfi23AdvancedStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(2)
      })

      test('should call updateScheduleByScheduleId with each successful schedulePendingSettlements.scheduleId', async () => {
        await processSfi23AdvancedStatements()

        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[0].scheduleId)
      })

      test('should return undefined', async () => {
        const result = await processSfi23AdvancedStatements()
        expect(result).toBeUndefined()
      })
    })

    describe('when updateScheduleByScheduleId throws', () => {
      beforeEach(async () => {
        updateScheduleByScheduleId.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('Updating issue')).mockResolvedValueOnce(undefined)
      })

      test('should call getSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(getSfi23AdvancedStatement).toHaveBeenCalled()
      })

      test('should call getSfi23AdvancedStatement 3 times', async () => {
        await processSfi23AdvancedStatements()
        expect(getSfi23AdvancedStatement).toHaveBeenCalledTimes(3)
      })

      test('should call getSfi23AdvancedStatement with each schedulePendingSettlements().settlementId and schedulePendingSettlements().scheduleId', async () => {
        await processSfi23AdvancedStatements()

        expect(getSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].settlementId, (await schedulePendingSettlements())[0].scheduleId)
        expect(getSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].settlementId, (await schedulePendingSettlements())[1].scheduleId)
        expect(getSfi23AdvancedStatement).toHaveBeenNthCalledWith(3, (await schedulePendingSettlements())[2].settlementId, (await schedulePendingSettlements())[2].scheduleId)
      })

      test('should call validateSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(validateSfi23AdvancedStatement).toHaveBeenCalled()
      })

      test('should call validateSfi23AdvancedStatement 3 times', async () => {
        await processSfi23AdvancedStatements()
        expect(validateSfi23AdvancedStatement).toHaveBeenCalledTimes(3)
      })

      test('should call validateSfi23AdvancedStatement with each getSfi23AdvancedStatement()', async () => {
        await processSfi23AdvancedStatements()

        expect(validateSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, await getSfi23AdvancedStatement())
        expect(validateSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, await getSfi23AdvancedStatement())
        expect(validateSfi23AdvancedStatement).toHaveBeenNthCalledWith(3, await getSfi23AdvancedStatement())
      })

      test('should call sendSfi23AdvancedStatement', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).toHaveBeenCalled()
      })

      test('should call sendSfi23AdvancedStatement 3 times', async () => {
        await processSfi23AdvancedStatements()
        expect(sendSfi23AdvancedStatement).toHaveBeenCalledTimes(3)
      })

      test('should call sendSfi23AdvancedStatement with each getSfi23AdvancedStatement()', async () => {
        await processSfi23AdvancedStatements()

        expect(sendSfi23AdvancedStatement).toHaveBeenNthCalledWith(1, await getSfi23AdvancedStatement())
        expect(sendSfi23AdvancedStatement).toHaveBeenNthCalledWith(2, await getSfi23AdvancedStatement())
        expect(sendSfi23AdvancedStatement).toHaveBeenNthCalledWith(3, await getSfi23AdvancedStatement())
      })

      test('should call updateScheduleByScheduleId', async () => {
        await processSfi23AdvancedStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalled()
      })

      test('should call updateScheduleByScheduleId 3 times', async () => {
        await processSfi23AdvancedStatements()
        expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(3)
      })

      test('should call updateScheduleByScheduleId with each schedulePendingSettlements.scheduleId', async () => {
        await processSfi23AdvancedStatements()

        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[0].scheduleId)
        expect(updateScheduleByScheduleId).toHaveBeenNthCalledWith(3, (await schedulePendingSettlements())[0].scheduleId)
      })

      test('should return undefined', async () => {
        const result = await processSfi23AdvancedStatements()
        expect(result).toBeUndefined()
      })
    })
  })
})
