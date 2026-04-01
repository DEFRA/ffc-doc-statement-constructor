jest.mock('ffc-messaging')
jest.mock('../../../app/inbound/statement-data/process-statement-data')
const processStatementData = require('../../../app/inbound/statement-data/process-statement-data')
const processStatementDataMessage = require('../../../app/messaging/process-statement-data-message')

let receiver
let organisation
let message

describe('process statement data message', () => {
  beforeEach(() => {
    processStatementData.mockResolvedValue(undefined)

    organisation = structuredClone(require('../../mock-objects/mock-organisation'))

    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }

    message = { body: organisation }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when processStatementData succeeds', () => {
    test.each([
      ['calls processStatementData', () => expect(processStatementData).toHaveBeenCalled()],
      ['calls processStatementData once', () => expect(processStatementData).toHaveBeenCalledTimes(1)],
      ['calls processStatementData with organisation', () => expect(processStatementData).toHaveBeenCalledWith(organisation)],
      ['calls receiver.completeMessage', () => expect(receiver.completeMessage).toHaveBeenCalled()],
      ['calls receiver.completeMessage once', () => expect(receiver.completeMessage).toHaveBeenCalledTimes(1)],
      ['calls receiver.completeMessage with message', () => expect(receiver.completeMessage).toHaveBeenCalledWith(message)]
    ])('%s', async (_desc, assertion) => {
      await processStatementDataMessage(message, receiver)
      assertion()
    })
  })

  describe('when processStatementData throws', () => {
    beforeEach(() => {
      processStatementData.mockRejectedValue(new Error('Transaction failed'))
    })

    test.each([
      ['does not throw', async () => {
        const wrapper = async () => await processStatementDataMessage(message, receiver)
        await expect(wrapper()).resolves.not.toThrow()
      }],
      ['does not call receiver.completeMessage', async () => {
        try { await processStatementDataMessage(message, receiver) } catch {}
        expect(receiver.completeMessage).not.toHaveBeenCalled()
      }]
    ])('%s', async (_desc, fn) => fn())
  })

  test('does not throw when receiver.completeMessage throws', async () => {
    receiver.completeMessage.mockRejectedValue(new Error('Azure difficulties'))
    const wrapper = async () => await processStatementDataMessage(message, receiver)
    await expect(wrapper()).resolves.not.toThrow()
  })

  describe('console logging for different statement types', () => {
    let logSpy

    beforeEach(() => {
      logSpy = jest.spyOn(console, 'log').mockImplementation()
    })

    afterEach(() => {
      logSpy.mockRestore()
    })

    test('logs paymentReference for d365 statement type', async () => {
      const d365Statement = { type: 'd365', paymentReference: 'PY1234567' }
      message.body = d365Statement

      await processStatementDataMessage(message, receiver)

      expect(logSpy).toHaveBeenCalledWith('Processing statement data - (d365): paymentReference: PY1234567')
    })

    test('logs paymentReference for dax statement type', async () => {
      const daxStatement = { type: 'dax', paymentReference: 'PY7654321' }
      message.body = daxStatement

      await processStatementDataMessage(message, receiver)

      expect(logSpy).toHaveBeenCalledWith('Processing statement data - (dax): paymentReference: PY7654321')
    })

    test('logs frn and sbi for organisation statement type', async () => {
      const organisationStatement = { type: 'organisation', frn: 1234567890, sbi: 123456789 }
      message.body = organisationStatement

      await processStatementDataMessage(message, receiver)

      expect(logSpy).toHaveBeenCalledWith('Processing statement data - (organisation): frn: 1234567890, sbi: 123456789')
    })

    test('logs frn and sbi for calculation statement type', async () => {
      const calculationStatement = { type: 'calculation', frn: 9876543210, sbi: 987654321 }
      message.body = calculationStatement

      await processStatementDataMessage(message, receiver)

      expect(logSpy).toHaveBeenCalledWith('Processing statement data - (calculation): frn: 9876543210, sbi: 987654321')
    })
  })

  describe('console logging for error scenarios', () => {
    let errorSpy

    beforeEach(() => {
      errorSpy = jest.spyOn(console, 'error').mockImplementation()
    })

    afterEach(() => {
      errorSpy.mockRestore()
    })

    test('logs error when processStatementData throws', async () => {
      const testError = new Error('Processing error')
      processStatementData.mockRejectedValue(testError)

      await processStatementDataMessage(message, receiver)

      expect(errorSpy).toHaveBeenCalledWith('Unable to process statement message:', testError)
    })

    test('calls deadLetterMessage when processStatementData throws', async () => {
      processStatementData.mockRejectedValue(new Error('Processing error'))

      await processStatementDataMessage(message, receiver)

      expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
    })
  })
})
