jest.mock('ffc-messaging')

jest.mock('../../../app/inbound')
const { processStatementData } = require('../../../app/inbound')

const processStatementDataMessage = require('../../../app/messaging/process-statement-data-message')

let receiver
let organisation
let message

describe('process statement data message', () => {
  beforeEach(() => {
    processStatementData.mockReturnValue(undefined)

    organisation = JSON.parse(JSON.stringify(require('../../mock-objects/mock-organisation')))

    receiver = {
      completeMessage: jest.fn()
    }

    message = { body: organisation }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call processStatementData when nothing throws', async () => {
    await processStatementDataMessage(message, receiver)
    expect(processStatementData).toHaveBeenCalled()
  })

  test('should call processStatementData once when nothing throws', async () => {
    await processStatementDataMessage(message, receiver)
    expect(processStatementData).toHaveBeenCalledTimes(1)
  })

  test('should call processStatementData with organisation when nothing throws', async () => {
    await processStatementDataMessage(message, receiver)
    expect(processStatementData).toHaveBeenCalledWith(organisation)
  })

  test('should not throw when processStatementData throws', async () => {
    processStatementData.mockRejectedValue(new Error('Database save issue'))

    const wrapper = async () => {
      await processStatementDataMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call receiver.completeMessage when nothing throws', async () => {
    await processStatementDataMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalled()
  })

  test('should call receiver.completeMessage once when nothing throws', async () => {
    await processStatementDataMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledTimes(1)
  })

  test('should call receiver.completeMessage with message when nothing throws', async () => {
    await processStatementDataMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should not call receiver.completeMessage when processStatementData throws', async () => {
    processStatementData.mockRejectedValue(new Error('Transaction failed'))
    try { await processStatementDataMessage(message, receiver) } catch {}
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })

  test('should not throw when processStatementData throws', async () => {
    processStatementData.mockRejectedValue(new Error('Transaction failed'))

    const wrapper = async () => {
      await processStatementDataMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when receiver.completeMessage throws', async () => {
    receiver.completeMessage.mockRejectedValue(new Error('Azure difficulties'))

    const wrapper = async () => {
      await processStatementDataMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })
})
