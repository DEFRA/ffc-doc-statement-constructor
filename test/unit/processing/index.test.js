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

jest.mock('../../../app/processing/process-sfi-23-quarterly-statements')
const processSfi23QuarterlyStatement = require('../../../app/processing/process-sfi-23-quarterly-statements')

jest.mock('../../../app/processing/process-delinked-payment-statements')
const processDelinkedStatement = require('../../../app/processing/process-delinked-payment-statements')

jest.mock('../../../app/messaging/wait-for-idle-messaging')
const waitForIdleMessaging = require('../../../app/messaging/wait-for-idle-messaging')

const processing = require('../../../app/processing')

describe('start processing', () => {
  beforeEach(() => {
    processingConfig.statementProcessingInterval = 10000
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when sfi-23-quarterly-statement-constructor, delinkedPaymentStatements are active', () => {
    beforeEach(() => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = true
    })

    test('should call waitForIdleMessaging', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalled()
    })

    test('should call waitForIdleMessaging five times', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(2)
    })

    test('should call processSfi23QuarterlyStatement', async () => {
      await processing.start()
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
    })

    test('should call processSfi23QuarterlyStatement once', async () => {
      await processing.start()
      expect(processSfi23QuarterlyStatement).toHaveBeenCalledTimes(1)
    })

    test('should call processDelinkedStatement', async () => {
      await processing.start()
      expect(processDelinkedStatement).toHaveBeenCalled()
    })

    test('should call processDelinkedStatement once', async () => {
      await processing.start()
      expect(processDelinkedStatement).toHaveBeenCalledTimes(1)
    })

    test('should call setTimeout', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalled()
    })

    test('should call setTimeout once', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalledTimes(1)
    })

    test('should call setTimeout with processing.start and processingConfig.statementProcessingInterval', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.statementProcessingInterval)
    })
  })

  describe('when sfi-23-quarterly-statement-constructor is active with delinkedStatement not active', () => {
    beforeEach(() => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = true
      processingConfig.delinkedStatementProcessingActive = false
    })

    test('should call waitForIdleMessaging', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalled()
    })

    test('should call waitForIdleMessaging once', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(1)
    })

    test('should not call processDelinkedStatement', async () => {
      await processing.start()
      expect(processDelinkedStatement).not.toHaveBeenCalled()
    })

    test('should call processSfi23QuarterlyStatement', async () => {
      await processing.start()
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
    })

    test('should call processSfi23QuarterlyStatement once', async () => {
      await processing.start()
      expect(processSfi23QuarterlyStatement).toHaveBeenCalledTimes(1)
    })

    test('should call setTimeout', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalled()
    })

    test('should call setTimeout once', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalledTimes(1)
    })

    test('should call setTimeout with processing.start and processingConfig.statementProcessingInterval', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.statementProcessingInterval)
    })
  })

  describe('when sfi-23-quarterly-statement-constructor and delinkedStatement not active', () => {
    beforeEach(() => {
      processingConfig.sfi23QuarterlyStatementProcessingActive = false
      processingConfig.delinkedStatementProcessingActive = false
    })

    test('should not call waitForIdleMessaging', async () => {
      await processing.start()
      expect(waitForIdleMessaging).not.toHaveBeenCalled()
    })

    test('should not call processSfi23QuarterlyStatement', async () => {
      await processing.start()
      expect(processSfi23QuarterlyStatement).not.toHaveBeenCalled()
    })

    test('should not call processDelinkedStatement', async () => {
      await processing.start()
      expect(processDelinkedStatement).not.toHaveBeenCalled()
    })

    test('should call setTimeout', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalled()
    })

    test('should call setTimeout once', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalledTimes(1)
    })

    test('should call setTimeout with processing.start and processingConfig.statementProcessingInterval', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.statementProcessingInterval)
    })
  })
})
