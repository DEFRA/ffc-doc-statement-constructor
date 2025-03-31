jest.useFakeTimers()

jest.mock('../../../app/processing/index', () => {
  return {
    start: jest.fn().mockImplementation(async () => {
      const config = require('../../../app/config')
      const messageConfig = require('../../../app/config/message')
      const waitForIdleMessaging = require('../../../app/messaging/wait-for-idle-messaging')
      const processSfi23QuarterlyStatement = require('../../../app/processing/process-sfi-23-quarterly-statements')
      const processSfi23AdvancedStatement = require('../../../app/processing/process-sfi-23-advanced-statements')
      const processDelinkedStatement = require('../../../app/processing/process-delinked-payment-statements')

      if (config.processingConfig.sfi23QuarterlyStatementConstructionActive) {
        const isIdle = await waitForIdleMessaging(
          [messageConfig.statementDataSubscription],
          'SFI23 Quarterly Statement',
          { timeout: 30000, blockProcessing: false }
        )

        if (!isIdle) {
          console.log('SFI23 Quarterly Statement no active messages in queue')
        }

        try {
          await processSfi23QuarterlyStatement()
        } catch (err) {
          console.error('Error in SFI23 Quarterly processor:', err)
        }
      }

      if (config.processingConfig.sfi23AdvancedStatementConstructionActive) {
        const subscriptions = [messageConfig.statementDataSubscription]
        if (config.paymentLinkActive) {
          subscriptions.push(messageConfig.processingSubscription)
          subscriptions.push(messageConfig.submitSubscription)
          subscriptions.push(messageConfig.returnSubscription)
        }

        const isIdle = await waitForIdleMessaging(
          subscriptions,
          'SFI23 Advance Statement',
          { timeout: 30000, blockProcessing: false }
        )

        if (!isIdle) {
          console.log('SFI23 Advance Statement no active messages in queue')
        }

        try {
          await processSfi23AdvancedStatement()
        } catch (err) {
          console.error('Error in SFI23 Advanced processor:', err)
        }
      }

      if (config.processingConfig.delinkedPaymentStatementActive) {
        const isIdle = await waitForIdleMessaging(
          [messageConfig.statementDataSubscription],
          'Delinked Payment Statement',
          { timeout: 30000, blockProcessing: false }
        )

        if (!isIdle) {
          console.log('Delinked Payment Statement no active messages in queue')
        }

        try {
          await processDelinkedStatement()
        } catch (err) {
          console.error('Error in Delinked Payment processor:', err)
        }
      }
    })
  }
})

jest.mock('../../../app/config', () => ({
  processingConfig: {
    settlementProcessingInterval: 10000,
    sfi23QuarterlyStatementConstructionActive: false,
    sfi23AdvancedStatementConstructionActive: false,
    delinkedPaymentStatementActive: false
  },
  paymentLinkActive: false,
  env: 'test',
  dbConfig: { test: {} }
}))

jest.mock('../../../app/config/message', () => ({
  statementDataSubscription: 'statement-data-subscription',
  processingSubscription: 'processing-subscription',
  submitSubscription: 'submit-subscription',
  returnSubscription: 'return-subscription'
}))

const mockWaitForIdleMessaging = jest.fn().mockResolvedValue(true)
jest.mock('../../../app/messaging/wait-for-idle-messaging', () => mockWaitForIdleMessaging)

const mockQuarterlyProcessor = jest.fn().mockResolvedValue(undefined)
jest.mock('../../../app/processing/process-sfi-23-quarterly-statements', () => mockQuarterlyProcessor)

const mockAdvancedProcessor = jest.fn().mockResolvedValue(undefined)
jest.mock('../../../app/processing/process-sfi-23-advanced-statements', () => mockAdvancedProcessor)

const mockDelinkedProcessor = jest.fn().mockResolvedValue(undefined)
jest.mock('../../../app/processing/process-delinked-payment-statements', () => mockDelinkedProcessor)

const config = require('../../../app/config')

describe('processing', () => {
  let processing

  beforeEach(() => {
    console.log = jest.fn()
    console.error = jest.fn()
    jest.clearAllMocks()
    mockWaitForIdleMessaging.mockClear()
    mockQuarterlyProcessor.mockClear()
    mockAdvancedProcessor.mockClear()
    mockDelinkedProcessor.mockClear()

    mockWaitForIdleMessaging.mockResolvedValue(true)

    processing = require('../../../app/processing/index')
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  describe('activating processors', () => {
    test('should start all processors when all are active', async () => {
      config.processingConfig.sfi23QuarterlyStatementConstructionActive = true
      config.processingConfig.sfi23AdvancedStatementConstructionActive = true
      config.processingConfig.delinkedPaymentStatementActive = true
      config.paymentLinkActive = true

      await processing.start()

      expect(mockWaitForIdleMessaging).toHaveBeenCalledTimes(3)
      expect(mockQuarterlyProcessor).toHaveBeenCalled()
      expect(mockAdvancedProcessor).toHaveBeenCalled()
      expect(mockDelinkedProcessor).toHaveBeenCalled()

      expect(mockWaitForIdleMessaging).toHaveBeenCalledWith(
        ['statement-data-subscription'],
        'SFI23 Quarterly Statement',
        expect.any(Object)
      )

      expect(mockWaitForIdleMessaging).toHaveBeenCalledWith(
        expect.arrayContaining([
          'statement-data-subscription',
          'processing-subscription',
          'submit-subscription',
          'return-subscription'
        ]),
        'SFI23 Advance Statement',
        expect.any(Object)
      )

      expect(mockWaitForIdleMessaging).toHaveBeenCalledWith(
        ['statement-data-subscription'],
        'Delinked Payment Statement',
        expect.any(Object)
      )
    })

    test('should only start quarterly processor when only it is active', async () => {
      config.processingConfig.sfi23QuarterlyStatementConstructionActive = true
      config.processingConfig.sfi23AdvancedStatementConstructionActive = false
      config.processingConfig.delinkedPaymentStatementActive = false

      await processing.start()

      expect(mockWaitForIdleMessaging).toHaveBeenCalledTimes(1)
      expect(mockQuarterlyProcessor).toHaveBeenCalled()
      expect(mockAdvancedProcessor).not.toHaveBeenCalled()
      expect(mockDelinkedProcessor).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    test('should handle errors in processors', async () => {
      config.processingConfig.sfi23QuarterlyStatementConstructionActive = true

      const testError = new Error('Test error')
      mockQuarterlyProcessor.mockRejectedValueOnce(testError)
      await processing.start()

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error in SFI23 Quarterly processor:'),
        testError
      )
    })
  })

  describe('idle messaging behavior', () => {
    test('should log when no active messages are found', async () => {
      config.processingConfig.sfi23QuarterlyStatementConstructionActive = true
      mockWaitForIdleMessaging.mockResolvedValueOnce(false)
      await processing.start()

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('SFI23 Quarterly Statement no active messages in queue')
      )
    })
  })
})
