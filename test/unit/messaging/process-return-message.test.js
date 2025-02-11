jest.mock('ffc-messaging')

jest.mock('../../../app/inbound/return/process-return-settlement')
jest.mock('../../../app/messaging/publish-return-subscription-failed')

const processReturnSettlement = require('../../../app/inbound/return/process-return-settlement')
const publishReturnSubscriptionFailed = require('../../../app/messaging/publish-return-subscription-failed')
const processReturnMessage = require('../../../app/messaging/process-return-message')

let receiver
let settlement
let message

describe('process return message', () => {
  beforeEach(() => {
    processReturnSettlement.mockReturnValue(undefined)
    publishReturnSubscriptionFailed.mockReturnValue(undefined)
    settlement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-settlement')))
    receiver = {
      completeMessage: jest.fn()
    }
    message = { body: settlement }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call processReturnSettlement when nothing throws', async () => {
    await processReturnMessage(message, receiver)
    expect(processReturnSettlement).toHaveBeenCalled()
  })

  test('should call processReturnSettlement once when nothing throws', async () => {
    await processReturnMessage(message, receiver)
    expect(processReturnSettlement).toHaveBeenCalledTimes(1)
  })

  test('should call processReturnSettlement with settlement when nothing throws', async () => {
    await processReturnMessage(message, receiver)
    expect(processReturnSettlement).toHaveBeenCalledWith(settlement)
  })

  test('should not throw when processReturnSettlement throws', async () => {
    processReturnSettlement.mockRejectedValue(new Error('Transaction failed'))

    const wrapper = async () => {
      await processReturnMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call receiver.completeMessage when nothing throws', async () => {
    await processReturnMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalled()
  })

  test('should call receiver.completeMessage once when nothing throws', async () => {
    await processReturnMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledTimes(1)
  })

  test('should call receiver.completeMessage with message when nothing throws', async () => {
    await processReturnMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should not call receiver.completeMessage when processReturnSettlement throws', async () => {
    processReturnSettlement.mockRejectedValue(new Error('Transaction failed'))
    try { await processReturnMessage(message, receiver) } catch {}
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })

  test('should not throw when processReturnSettlement throws', async () => {
    processReturnSettlement.mockRejectedValue(new Error('Transaction failed'))

    const wrapper = async () => {
      await processReturnMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when receiver.completeMessage throws', async () => {
    receiver.completeMessage.mockRejectedValue(new Error('Azure difficulties'))

    const wrapper = async () => {
      await processReturnMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call publishReturnSubscriptionFailed and deadLetterMessage on error', async () => {
    const error = new Error('Test error')
    processReturnSettlement.mockRejectedValue(error)

    await processReturnMessage(message, receiver)
    expect(processReturnSettlement).toHaveBeenCalledWith(settlement)
    expect(publishReturnSubscriptionFailed).toHaveBeenCalledWith(settlement, error)
  })
})
