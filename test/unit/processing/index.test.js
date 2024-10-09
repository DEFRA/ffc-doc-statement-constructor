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

jest.mock('../../../app/processing/process-statements')
const processStatements = require('../../../app/processing/process-statements')

jest.mock('../../../app/processing/process-payment-schedules')
const processPaymentSchedules = require('../../../app/processing/process-payment-schedules')

jest.mock('../../../app/processing/process-sfi-23-quarterly-statements')
const processSfi23QuarterlyStatement = require('../../../app/processing/process-sfi-23-quarterly-statements')

jest.mock('../../../app/processing/process-delinked-payment-statements')
const processDelinkedStatement = require('../../../app/processing/process-delinked-payment-statements')

jest.mock('../../../app/processing/process-sfi-23-advanced-statements')
const processSfi23AdvancedStatements = require('../../../app/processing/process-sfi-23-advanced-statements')

jest.mock('../../../app/messaging/wait-for-idle-messaging')
const waitForIdleMessaging = require('../../../app/messaging/wait-for-idle-messaging')

const processing = require('../../../app/processing')

describe('start processing', () => {
  beforeEach(() => {
    processingConfig.settlementProcessingInterval = 10000
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when statement-construction, schedule-construction, sfi23QuarterlyStatements and delinkedPaymentStatements are active', () => {
    beforeEach(() => {
      processingConfig.statementConstructionActive = true
      processingConfig.scheduleConstructionActive = true
      processingConfig.sfi23QuarterlyStatementConstructionActive = true
      processingConfig.sfi23AdvancedStatementConstructionActive = true
      processingConfig.delinkedPaymentStatementActive = true
    })

    test('should call waitForIdleMessaging', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalled()
    })

    test('should call waitForIdleMessaging five times', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(5)
    })

    test('should call processSfi23QuarterlyStatement', async () => {
      await processing.start()
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
    })

    test('should call processSfi23QuarterlyStatement once', async () => {
      await processing.start()
      expect(processSfi23QuarterlyStatement).toHaveBeenCalledTimes(1)
    })
    test('should call processStatements', async () => {
      await processing.start()
      expect(processStatements).toHaveBeenCalled()
    })

    test('should call processStatements once', async () => {
      await processing.start()
      expect(processStatements).toHaveBeenCalledTimes(1)
    })

    test('should call processPaymentSchedules', async () => {
      await processing.start()
      expect(processPaymentSchedules).toHaveBeenCalled()
    })

    test('should call processPaymentSchedules once', async () => {
      await processing.start()
      expect(processPaymentSchedules).toHaveBeenCalledTimes(1)
    })

    test('should call processSfi23AdvancedStatements', async () => {
      await processing.start()
      expect(processSfi23AdvancedStatements).toHaveBeenCalled()
    })

    test('should call processSfi23AdvancedStatements once', async () => {
      await processing.start()
      expect(processSfi23AdvancedStatements).toHaveBeenCalledTimes(1)
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

    test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
    })
  })

  describe('when statement-construction is active with schedule-construction, sfi-23-quarterly-statement-constructor and delinkedStatement not active', () => {
    beforeEach(() => {
      processingConfig.statementConstructionActive = true
      processingConfig.scheduleConstructionActive = false
      processingConfig.sfi23QuarterlyStatementConstructionActive = false
      processingConfig.sfi23AdvancedStatementConstructionActive = false
      processingConfig.delinkedPaymentStatementActive = false
    })

    test('should call waitForIdleMessaging', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalled()
    })

    test('should call waitForIdleMessaging once', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(1)
    })

    test('should call processStatements', async () => {
      await processing.start()
      expect(processStatements).toHaveBeenCalled()
    })

    test('should call processStatements once', async () => {
      await processing.start()
      expect(processStatements).toHaveBeenCalledTimes(1)
    })

    test('should not call processSfi23QuarterlyStatement', async () => {
      await processing.start()
      expect(processSfi23QuarterlyStatement).not.toHaveBeenCalled()
    })

    test('should not call processPaymentSchedules', async () => {
      await processing.start()
      expect(processPaymentSchedules).not.toHaveBeenCalled()
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

    test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
    })
  })

  describe('when schedule construction is  active with schedule-construction and sfi-23-quarterly-statement-constructor not active', () => {
    beforeEach(() => {
      processingConfig.statementConstructionActive = false
      processingConfig.scheduleConstructionActive = true
      processingConfig.sf123QuarterlyStatementConstructionActive = false
      processingConfig.sfi23AdvancedStatementConstructionActive = false
      processingConfig.delinkedPaymentStatementActive = false
    })

    test('should call waitForIdleMessaging', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalled()
    })

    test('should call waitForIdleMessaging once', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(1)
    })

    test('should not call processStatements', async () => {
      await processing.start()
      expect(processStatements).not.toHaveBeenCalled()
    })

    test('should call processPaymentSchedules', async () => {
      await processing.start()
      expect(processPaymentSchedules).toHaveBeenCalled()
    })

    test('should not call processSfi23QuarterlyStatement', async () => {
      await processing.start()
      expect(processSfi23QuarterlyStatement).not.toHaveBeenCalled()
    })

    test('should not call processDelinkedStatement', async () => {
      await processing.start()
      expect(processDelinkedStatement).not.toHaveBeenCalled()
    })

    test('should call processPaymentSchedules once', async () => {
      await processing.start()
      expect(processPaymentSchedules).toHaveBeenCalledTimes(1)
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
  })

  describe('when sfi-23-quarterly-statement-constructor is active with delinkedStatement, schedule-construction and schedule-construction not active', () => {
    beforeEach(() => {
      processingConfig.statementConstructionActive = false
      processingConfig.scheduleConstructionActive = false
      processingConfig.sfi23QuarterlyStatementConstructionActive = true
      processingConfig.sfi23AdvancedStatementConstructionActive = false
      processingConfig.delinkedPaymentStatementActive = false
    })

    test('should call waitForIdleMessaging', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalled()
    })

    test('should call waitForIdleMessaging once', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(1)
    })

    test('should not call processStatements', async () => {
      await processing.start()
      expect(processStatements).not.toHaveBeenCalled()
    })

    test('should not call processPaymentSchedules', async () => {
      await processing.start()
      expect(processPaymentSchedules).not.toHaveBeenCalled()
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

    test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
    })
  })

  describe('when statement-construction, schedule-construction, sfi-23-quarterly-statement-constructor and delinkedStatement not active', () => {
    beforeEach(() => {
      processingConfig.statementConstructionActive = false
      processingConfig.scheduleConstructionActive = false
      processingConfig.sfi23QuarterlyStatementConstructionActive = false
      processingConfig.sfi23AdvancedStatementConstructionActive = false
      processingConfig.delinkedPaymentStatementActive = false
    })

    test('should not call waitForIdleMessaging', async () => {
      await processing.start()
      expect(waitForIdleMessaging).not.toHaveBeenCalled()
    })

    test('should not call processStatements', async () => {
      await processing.start()
      expect(processStatements).not.toHaveBeenCalled()
    })

    test('should not call processPaymentSchedules', async () => {
      await processing.start()
      expect(processPaymentSchedules).not.toHaveBeenCalled()
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

    test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval', async () => {
      await processing.start()
      expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
    })
  })
})
