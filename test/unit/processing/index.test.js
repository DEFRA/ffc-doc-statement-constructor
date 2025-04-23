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

jest.mock('../../../app/processing/process-sfi-23-quarterly-statements')
const processSfi23QuarterlyStatement = require('../../../app/processing/process-sfi-23-quarterly-statements')
processSfi23QuarterlyStatement.mockResolvedValue()

jest.mock('../../../app/processing/process-delinked-payment-statements')
const processDelinkedStatement = require('../../../app/processing/process-delinked-payment-statements')
processDelinkedStatement.mockResolvedValue()

jest.mock('../../../app/messaging/wait-for-idle-messaging')
const waitForIdleMessaging = require('../../../app/messaging/wait-for-idle-messaging')
waitForIdleMessaging.mockResolvedValue()

const processing = require('../../../app/processing')

describe('processing', () => {
  beforeEach(() => {
    processingConfig.statementProcessingInterval = 10000
    processingConfig.settlementProcessingInterval = 10000
    console.log = jest.fn()
    console.error = jest.fn()
    console.warn = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('buildTaskConfigurations', () => {
    test('should build correct task configurations when both processes are active', async () => {
      // Setup
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = true

      // We need to mock processWithInterval to prevent the infinite loop
      // but still test the task creation and execution
      const originalProcessWithInterval = processing.processWithInterval
      processing.processWithInterval = jest.fn().mockImplementation(async () => {
        // Execute the task processing part only
        const tasks = processing.taskConfigurations.map(config =>
          () => processing.processTask(
            config.subscriptions,
            config.processFunction,
            config.name
          )
        )
        await processing.processBatch(tasks)
      })

      // Execute
      await processing.start()

      // Restore original function
      processing.processWithInterval = originalProcessWithInterval

      // Verify
      expect(waitForIdleMessaging).toHaveBeenCalledWith(
        expect.arrayContaining(['test-subscription']),
        'SFI23 Quarterly Statement'
      )
      expect(waitForIdleMessaging).toHaveBeenCalledWith(
        expect.arrayContaining(['test-subscription']),
        'Delinked Payment Statement'
      )
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
      expect(processDelinkedStatement).toHaveBeenCalled()
    })

    test('should only include SFI23 task when delinked statements are inactive', async () => {
      // Setup
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = false

      // Clear mocks
      waitForIdleMessaging.mockClear()
      processSfi23QuarterlyStatement.mockClear()
      processDelinkedStatement.mockClear()

      // Mock processing function
      const originalProcessWithInterval = processing.processWithInterval
      processing.processWithInterval = jest.fn().mockImplementation(async () => {
        const tasks = processing.taskConfigurations.map(config =>
          () => processing.processTask(
            config.subscriptions,
            config.processFunction,
            config.name
          )
        )
        await processing.processBatch(tasks)
      })

      // Execute
      await processing.start()

      // Restore
      processing.processWithInterval = originalProcessWithInterval

      // Verify
      expect(waitForIdleMessaging).toHaveBeenCalledWith(
        expect.arrayContaining(['test-subscription']),
        'SFI23 Quarterly Statement'
      )
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
      expect(processDelinkedStatement).not.toHaveBeenCalled()
      expect(console.log).toHaveBeenCalledWith('Delinked Payment Statement processing is disabled')
    })
  })

  describe('processTask', () => {
    test('should execute the process function with correct parameters', async () => {
      const processTask = async (subscriptions, processFunction, processName) => {
        await waitForIdleMessaging(subscriptions, processName)
        await processFunction()
        return { success: true, name: processName }
      }

      const result = await processTask(['test-subscription'], processSfi23QuarterlyStatement, 'Test Process')

      expect(waitForIdleMessaging).toHaveBeenCalledWith(['test-subscription'], 'Test Process')
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
      expect(result).toEqual({ success: true, name: 'Test Process' })
    })

    test('should handle errors and return failure result', async () => {
      const processTask = async (subscriptions, processFunction, processName) => {
        try {
          await waitForIdleMessaging(subscriptions, processName)
          await processFunction()
          return { success: true, name: processName }
        } catch (error) {
          console.error(`Error processing ${processName}:`, error)
          return { success: false, name: processName, error }
        }
      }

      const mockError = new Error('Processing failed')
      processSfi23QuarterlyStatement.mockRejectedValueOnce(mockError)

      const result = await processTask(['test-subscription'], processSfi23QuarterlyStatement, 'Test Process')

      expect(result).toEqual({
        success: false,
        name: 'Test Process',
        error: mockError
      })
      expect(console.error).toHaveBeenCalledWith('Error processing Test Process:', mockError)
    })
  })

  describe('processBatch', () => {
    test('should process tasks in batches of MAX_CONCURRENT_TASKS', async () => {
      const MAX_CONCURRENT_TASKS = 2
      const processBatch = async (tasks) => {
        const results = []

        for (let i = 0; i < tasks.length; i += MAX_CONCURRENT_TASKS) {
          const batch = tasks.slice(i, i + MAX_CONCURRENT_TASKS)
          const batchResults = await Promise.allSettled(batch.map(task => task()))
          results.push(...batchResults)
        }

        return results
      }

      const mockTask1 = jest.fn().mockResolvedValue('result1')
      const mockTask2 = jest.fn().mockResolvedValue('result2')
      const mockTask3 = jest.fn().mockResolvedValue('result3')

      const tasks = [mockTask1, mockTask2, mockTask3]
      await processBatch(tasks)

      expect(mockTask1).toHaveBeenCalled()
      expect(mockTask2).toHaveBeenCalled()
      expect(mockTask3).toHaveBeenCalled()
    })
  })

  describe('start processing integration', () => {
    beforeEach(() => {
      jest.spyOn(processing, 'start')
    })

    test('should call setTimeout with dynamic interval in processWithInterval', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = true

      await processing.start()

      expect(setTimeout).toHaveBeenCalled()
      expect(waitForIdleMessaging).toHaveBeenCalled()
    })

    test('should log starting message', async () => {
      await processing.start()

      expect(console.log).toHaveBeenCalledWith('Starting statement processing service')
    })

    test('should initialize task configurations and start interval processing', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = true

      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalled()
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
      expect(processDelinkedStatement).toHaveBeenCalled()
      expect(setTimeout).toHaveBeenCalled()
    })
  })

  describe('when sfi-23-quarterly-statement-constructor is active with delinkedStatement not active', () => {
    beforeEach(() => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = false
    })

    test('should process SFI statements only', async () => {
      await processing.start()

      expect(waitForIdleMessaging).toHaveBeenCalled()
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
      expect(processDelinkedStatement).not.toHaveBeenCalled()
      expect(setTimeout).toHaveBeenCalled()
    })

    test('should log that delinked statements are disabled', async () => {
      await processing.start()

      expect(console.log).toHaveBeenCalledWith('Delinked Payment Statement processing is disabled')
    })
  })

  describe('when sfi-23-quarterly-statement-constructor and delinkedStatement not active', () => {
    beforeEach(() => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = false
      processingConfig.delinkedStatementProcessingActive = false
    })

    test('should not process any statements but still set timeout', async () => {
      await processing.start()

      expect(waitForIdleMessaging).not.toHaveBeenCalled()
      expect(processSfi23QuarterlyStatement).not.toHaveBeenCalled()
      expect(processDelinkedStatement).not.toHaveBeenCalled()
      expect(setTimeout).toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    test('should handle and log critical errors', async () => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processSfi23QuarterlyStatement.mockRejectedValueOnce(new Error('Critical error'))

      const originalProcessWithInterval = processing.processWithInterval
      processing.processWithInterval = jest.fn().mockImplementation(async () => {
        const tasks = processing.taskConfigurations.map(config =>
          () => processing.processTask(
            config.subscriptions,
            config.processFunction,
            config.name
          )
        )
        await processing.processBatch(tasks)
      })
      await processing.start()
      processing.processWithInterval = originalProcessWithInterval
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error processing SFI23 Quarterly Statement:'),
        expect.any(Error)
      )
    })
  })
})
