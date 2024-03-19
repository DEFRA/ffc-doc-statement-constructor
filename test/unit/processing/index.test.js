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

  describe('when statement-construction, schedule-construction and sfi23QuarterlyStatements are active', () => {
    beforeEach(() => {
      processingConfig.statementConstructionActive = true
      processingConfig.scheduleConstructionActive = true
      processingConfig.sfi23QuarterlyStatementConstructionActive = true
    })

    test('should call waitForIdleMessaging', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalled()
    })

    test('should call waitForIdleMessaging thrice', async () => {
      await processing.start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(3)
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

  describe('when statement-construction is active with schedule-construction and sfi-23-quarterly-statement-constructor not active', () => {
    beforeEach(() => {
      processingConfig.statementConstructionActive = true
      processingConfig.scheduleConstructionActive = false
      processingConfig.sfi23QuarterlyStatementConstructionActive = false
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

  describe('when sfi-23-quarterly-statement-constructor is active with schedule-construction and schedule-construction not active', () => {
    beforeEach(() => {
      processingConfig.statementConstructionActive = false
      processingConfig.scheduleConstructionActive = false
      processingConfig.sfi23QuarterlyStatementConstructionActive = true
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

  describe('when statement-construction, schedule-construction and sfi-23-quarterly-statemnent-constructor not active', () => {
    beforeEach(() => {
      processingConfig.statementConstructionActive = false
      processingConfig.scheduleConstructionActive = false
      processingConfig.sfi23QuarterlyStatementConstructionActive = false
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
