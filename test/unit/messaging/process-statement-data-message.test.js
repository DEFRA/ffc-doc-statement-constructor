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

    organisation = JSON.parse(JSON.stringify(require('../../mock-objects/mock-organisation')))

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
})
