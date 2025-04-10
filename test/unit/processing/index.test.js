jest.useFakeTimers()
jest.spyOn(global, 'setTimeout')

const processSfi23QuarterlyStatement = require('../../../app/processing/process-sfi-23-quarterly-statements')
const processSfi23AdvancedStatement = require('../../../app/processing/process-sfi-23-advanced-statements')
const processDelinkedStatement = require('../../../app/processing/process-delinked-payment-statements')
const waitForIdleMessaging = require('../../../app/messaging/wait-for-idle-messaging')

const { processingConfig } = require('../../../app/config')

jest.mock('../../../app/processing/process-sfi-23-quarterly-statements')
jest.mock('../../../app/processing/process-sfi-23-advanced-statements')
jest.mock('../../../app/processing/process-delinked-payment-statements')
jest.mock('../../../app/messaging/wait-for-idle-messaging')

const { start } = require('../../../app/processing')

describe('start processing', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call setTimeout once when running start', async () => {
    await start()
    jest.advanceTimersByTime(processingConfig.settlementProcessingInterval)
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  describe('when sfi-23-advanced-statement-constructor, sfi-23-quarterly-statement-constructor and delinkedStatement are active', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.spyOn(global, 'setTimeout')

      processingConfig.sfi23QuarterlyStatementConstructionActive = true
      processingConfig.sfi23AdvancedStatementConstructionActive = true
      processingConfig.delinkedPaymentStatementActive = true
      processingConfig.settlementProcessingInterval = 10000 // 10 seconds
    })

    test('starts the processing service and schedules the next interval', async () => {
      await start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(3)
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), processingConfig.settlementProcessingInterval)
    })

    test('processSfi23QuarterlyStatement to be called', async () => {
      await start() 
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
    })

    test('processSfi23AdvancedStatement to be called', async () => {
      await start() 
      expect(processSfi23AdvancedStatement).toHaveBeenCalled()
    })
    test('processDelinkedStatement to be called', async () => {
      await start() 
      expect(processDelinkedStatement).toHaveBeenCalled()
    })
  })

  describe('when sfi-23-advanced-statement-constructor, sfi-23-quarterly-statement-constructor and delinkedStatement not active', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.spyOn(global, 'setTimeout')

      // Enable all processing types
      processingConfig.sfi23QuarterlyStatementConstructionActive = false
      processingConfig.sfi23AdvancedStatementConstructionActive = false
      processingConfig.delinkedPaymentStatementActive = false
      processingConfig.settlementProcessingInterval = 10000 // 10 seconds
    })

    test('starts the processing service and schedules the next interval', async () => {
      await start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(0)
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), processingConfig.settlementProcessingInterval)
    })

    test('processSfi23QuarterlyStatement to not be called', async () => {
      await start() 
      expect(processSfi23QuarterlyStatement).not.toHaveBeenCalled()
    })

    test('processSfi23AdvancedStatement to not be called', async () => {
      await start() 
      expect(processSfi23AdvancedStatement).not.toHaveBeenCalled()
    })

    test('processDelinkedStatement to not be called', async () => {
      await start() 
      expect(processDelinkedStatement).not.toHaveBeenCalled()
    })
  })

  describe('when sfi-23-quarterly-statement-constructor is active, sfi-23-advanced-statement-constructor and delinkedStatement not active', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.spyOn(global, 'setTimeout')
      jest.resetModules()
    
      processingConfig.sfi23QuarterlyStatementConstructionActive = true
      processingConfig.sfi23AdvancedStatementConstructionActive = false
      processingConfig.delinkedPaymentStatementActive = false
      processingConfig.settlementProcessingInterval = 10000
    })

    test('starts the processing service and schedules the next interval', async () => {
      await start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(1)
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), processingConfig.settlementProcessingInterval)
    })

    test('processSfi23QuarterlyStatement to be called', async () => {
      await start() 
      expect(processSfi23QuarterlyStatement).toHaveBeenCalled()
    })

    test('processSfi23AdvancedStatement to not be called', async () => {
      await start() 
      expect(processSfi23AdvancedStatement).not.toHaveBeenCalled()
    })

    test('processDelinkedStatement to not be called', async () => {
      await start() 
      expect(processDelinkedStatement).not.toHaveBeenCalled()
    })
  })

  describe('when sfi-23-advanced-statement-constructor is active, sfi-23-quarterly-statement-constructor and delinkedStatement not active', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.spyOn(global, 'setTimeout')

      // Enable all processing types
      processingConfig.sfi23QuarterlyStatementConstructionActive = false
      processingConfig.sfi23AdvancedStatementConstructionActive = true
      processingConfig.delinkedPaymentStatementActive = false
      processingConfig.settlementProcessingInterval = 10000 // 10 seconds
    })

    test('starts the processing service and schedules the next interval', async () => {
      await start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(1)
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), processingConfig.settlementProcessingInterval)
    })

    test('processSfi23QuarterlyStatement to not be called', async () => {
      await start() 
      expect(processSfi23QuarterlyStatement).not.toHaveBeenCalled()
    })

    test('processSfi23AdvancedStatement to be called one time', async () => {
      await start() 
      expect(processSfi23AdvancedStatement).toHaveBeenCalled()
    })

    test('processDelinkedStatement to not be called', async () => {
      await start() 
      expect(processDelinkedStatement).not.toHaveBeenCalled()
    })
  })

  describe('when delinkedStatement is active, sfi-23-quarterly-statement-constructor and sfi-23-advanced-statement-constructor not active', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.spyOn(global, 'setTimeout')

      // Enable all processing types
      processingConfig.sfi23QuarterlyStatementConstructionActive = false
      processingConfig.sfi23AdvancedStatementConstructionActive = false
      processingConfig.delinkedPaymentStatementActive = true
      processingConfig.settlementProcessingInterval = 10000 // 10 seconds
    })

    test('starts the processing service and schedules the next interval', async () => {
      await start()
      expect(waitForIdleMessaging).toHaveBeenCalledTimes(1)
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), processingConfig.settlementProcessingInterval)
    })

    test('processSfi23QuarterlyStatement to not be called', async () => {
      await start() 
      expect(processSfi23QuarterlyStatement).not.toHaveBeenCalled()
    })

    test('processSfi23AdvancedStatement to not be called', async () => {
      await start() 
      expect(processSfi23AdvancedStatement).not.toHaveBeenCalled()
    })

    test('processDelinkedStatement to be called one time', async () => {
      await start() 
      expect(processDelinkedStatement).toHaveBeenCalled()
    })
  })
})
