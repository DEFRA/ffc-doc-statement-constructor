jest.useFakeTimers()
jest.spyOn(global, 'setTimeout')

jest.mock('../../../app/config')
const { processingConfig } = require('../../../app/config')

jest.mock('../../../app/config/message', () => ({
  statementDataSubscription: 'test-subscription'
}))

const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../app/data', () => ({
  sequelize: {
    transaction: jest.fn().mockImplementation(() => ({ ...mockTransaction }))
  }
}))

jest.mock('../../../app/processing/process-sfi-23-quarterly-statements')
const processSfi23QuarterlyStatement = require('../../../app/processing/process-sfi-23-quarterly-statements')

jest.mock('../../../app/processing/process-delinked-payment-statements')
const processDelinkedStatement = require('../../../app/processing/process-delinked-payment-statements')

jest.mock('../../../app/processing/window-helpers', () => ({
  isWithinWindow: jest.fn(),
  isPollDay: jest.fn()
}))
const { isWithinWindow, isPollDay } = require('../../../app/processing/window-helpers')

const processing = require('../../../app/processing')

describe('processing', () => {
  beforeEach(() => {
    processingConfig.statementProcessingInterval = 10000
    processingConfig.settlementProcessingInterval = 10000
    processingConfig.pollWindow.enabled = true
    console.log = jest.fn()
    console.error = jest.fn()
    console.warn = jest.fn()
    processSfi23QuarterlyStatement.mockReset()
    processDelinkedStatement.mockReset()
    processSfi23QuarterlyStatement.mockResolvedValue(1)
    processDelinkedStatement.mockResolvedValue(0)
    processing.lastHadWork = false
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('buildTaskConfigurations', () => {
    test('builds both tasks when both active', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = true
      isWithinWindow.mockReturnValue(true)
      isPollDay.mockReturnValue(true)
      await processing.start()
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
      expect(processDelinkedStatement).toHaveBeenCalled()
      expect(setTimeout).toHaveBeenCalled()
    })

    test('only includes SFI23 when delinked inactive and logs disabled', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = false
      isWithinWindow.mockReturnValue(true)
      isPollDay.mockReturnValue(true)
      await processing.start()
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
      expect(processDelinkedStatement).not.toHaveBeenCalled()
      expect(console.log).toHaveBeenCalledWith('Delinked Payment Statement processing is disabled')
    })
  })

  describe('processTask', () => {
    test('returns numeric processed value', async () => {
      processSfi23QuarterlyStatement.mockResolvedValue(3)
      const res = await processing.processTask(processSfi23QuarterlyStatement, 'Test')
      expect(res).toEqual({ success: true, name: 'Test', processed: 3 })
    })

    test('returns object processed property', async () => {
      processSfi23QuarterlyStatement.mockResolvedValue({ processed: 4 })
      const res = await processing.processTask(processSfi23QuarterlyStatement, 'TestObj')
      expect(res).toEqual({ success: true, name: 'TestObj', processed: 4 })
    })

    test('handles errors and logs', async () => {
      const err = new Error('boom')
      processSfi23QuarterlyStatement.mockRejectedValueOnce(err)
      const res = await processing.processTask(processSfi23QuarterlyStatement, 'ErrTest')
      expect(res.success).toBe(false)
      expect(res.processed).toBe(0)
      expect(console.error).toHaveBeenCalledWith('Error processing ErrTest:', err)
    })
  })

  describe('processBatch', () => {
    test('processes tasks in batches', async () => {
      const mockTask1 = jest.fn().mockResolvedValue('r1')
      const mockTask2 = jest.fn().mockResolvedValue('r2')
      const mockTask3 = jest.fn().mockResolvedValue('r3')
      const results = await processing.processBatch([mockTask1, mockTask2, mockTask3])
      expect(mockTask1).toHaveBeenCalled()
      expect(mockTask2).toHaveBeenCalled()
      expect(mockTask3).toHaveBeenCalled()
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('start and interval', () => {
    test('logs starting and schedules interval', async () => {
      await processing.start()
      expect(console.log).toHaveBeenCalledWith('Starting statement processing service')
      expect(setTimeout).toHaveBeenCalled()
    })
  })

  describe('conditional processing and logging', () => {
    test('processes when within window and on poll day', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = false
      isWithinWindow.mockReturnValue(true)
      isPollDay.mockReturnValue(true)
      processSfi23QuarterlyStatement.mockResolvedValue(1)
      await processing.start()
      expect(isWithinWindow).toHaveBeenCalledWith(processingConfig.pollWindow)
      expect(isPollDay).toHaveBeenCalledWith(processingConfig.pollWindow.days)
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
      expect(console.log).toHaveBeenCalledWith('All processing tasks completed successfully — processed 1 items')
      expect(console.log).toHaveBeenCalledWith('Delinked Payment Statement processing is disabled')
    })

    test('logs idle when no tasks configured after previously processing', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = false
      isWithinWindow.mockReturnValue(true)
      isPollDay.mockReturnValue(true)
      processSfi23QuarterlyStatement.mockResolvedValueOnce(1)
      await processing.processWithInterval()
      processingConfig.sfi23QuarterlyStatementProcessingActive = false
      processingConfig.delinkedStatementProcessingActive = false
      await processing.processWithInterval()
      expect(console.log).toHaveBeenCalledWith('Processing is idle: no tasks configured')
    })

    test('logs idle when items drop to zero after previously processing', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = false
      isWithinWindow.mockReturnValue(true)
      isPollDay.mockReturnValue(true)
      processSfi23QuarterlyStatement.mockResolvedValueOnce(1)
      await processing.processWithInterval()
      processSfi23QuarterlyStatement.mockResolvedValueOnce(0)
      await processing.processWithInterval()
      expect(console.log).toHaveBeenCalledWith('Delinked Payment Statement processing is disabled')
      expect(console.log).toHaveBeenCalledWith('Processing is idle: no items processed this cycle')
    })

    test('logs success when items processed', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = false
      isWithinWindow.mockReturnValue(true)
      isPollDay.mockReturnValue(true)
      processSfi23QuarterlyStatement.mockResolvedValue(2)
      await processing.processWithInterval()
      expect(console.log).toHaveBeenCalledWith('All processing tasks completed successfully — processed 2 items')
      expect(console.log).toHaveBeenCalledWith('Delinked Payment Statement processing is disabled')
    })

    test('logs warning when one task fails and another processes items', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = true
      isWithinWindow.mockReturnValue(true)
      isPollDay.mockReturnValue(true)
      processSfi23QuarterlyStatement.mockResolvedValueOnce(2)
      processDelinkedStatement.mockRejectedValueOnce(new Error('fail'))
      await processing.processWithInterval()
      expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/tasks failed/))
    })

    test('skips processing when outside window or not a poll day', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = false
      isWithinWindow.mockReturnValue(false)
      isPollDay.mockReturnValue(false)
      await processing.start()
      expect(isWithinWindow).toHaveBeenCalled()
      expect(console.log).toHaveBeenCalledWith('Outside processing window or not a processing day, skipping processing')
      expect(processSfi23QuarterlyStatement).not.toHaveBeenCalled()
    })

    test('processes when pollWindow.enabled false but window helpers return true', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = false
      processingConfig.pollWindow.enabled = false
      isWithinWindow.mockReturnValue(true)
      isPollDay.mockReturnValue(true)
      processSfi23QuarterlyStatement.mockResolvedValue(1)
      await processing.processWithInterval()
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
      expect(console.log).toHaveBeenCalledWith('All processing tasks completed successfully — processed 1 items')
      expect(console.log).toHaveBeenCalledWith('Delinked Payment Statement processing is disabled')
    })
  })
})
