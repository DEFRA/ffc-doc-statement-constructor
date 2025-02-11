jest.mock('ffc-messaging')

jest.mock('../../../app/inbound')
jest.mock('../../../app/messaging/publish-submit-subscription-failed')

const { processSubmitPaymentRequest } = require('../../../app/inbound')
const publishSubmitSubscriptionFailed = require('../../../app/messaging/publish-submit-subscription-failed')
const processSubmitMessage = require('../../../app/messaging/process-submit-message')

let receiver
let paymentRequest
let message

describe('process submit message', () => {
  beforeEach(() => {
    processSubmitPaymentRequest.mockReturnValue(undefined)
    publishSubmitSubscriptionFailed.mockReturnValue(undefined)

    paymentRequest = JSON.parse(JSON.stringify(require('../../mock-objects/mock-payment-request').submitPaymentRequest))

    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }

    message = { body: paymentRequest }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call processSubmitPaymentRequest when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(processSubmitPaymentRequest).toHaveBeenCalledWith(paymentRequest)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should call processSubmitPaymentRequest once when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(processSubmitPaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call processSubmitPaymentRequest with paymentRequest when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(processSubmitPaymentRequest).toHaveBeenCalledWith(paymentRequest)
  })

  test('should not throw when processSubmitPaymentRequest throws', async () => {
    processSubmitPaymentRequest.mockRejectedValue(new Error('Database save issue'))

    const wrapper = async () => {
      await processSubmitMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call receiver.completeMessage when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalled()
  })

  test('should not call receiver.deadLetterMessage when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(receiver.deadLetterMessage).not.toHaveBeenCalled()
  })

  test('should call receiver.completeMessage once when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledTimes(1)
  })

  test('should call receiver.completeMessage with message when nothing throws', async () => {
    await processSubmitMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should not call receiver.completeMessage when processSubmitPaymentRequest throws', async () => {
    processSubmitPaymentRequest.mockRejectedValue(new Error('Transaction failed'))
    try { await processSubmitMessage(message, receiver) } catch {}
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })

  test('should call receiver.deadLetterMessage when processSubmitPaymentRequest throws', async () => {
    processSubmitPaymentRequest.mockRejectedValue(new Error('Transaction failed'))
    try { await processSubmitMessage(message, receiver) } catch {}
    expect(receiver.deadLetterMessage).toHaveBeenCalled()
  })

  test('should not throw when processSubmitPaymentRequest throws', async () => {
    processSubmitPaymentRequest.mockRejectedValue(new Error('Transaction failed'))

    const wrapper = async () => {
      await processSubmitMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when receiver.completeMessage throws', async () => {
    receiver.completeMessage.mockRejectedValue(new Error('Azure difficulties'))

    const wrapper = async () => {
      await processSubmitMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call publishSubmitSubscriptionFailed and deadLetterMessage on error', async () => {
    const error = new Error('Test error')
    processSubmitPaymentRequest.mockRejectedValue(error)

    await processSubmitMessage(message, receiver)
    expect(processSubmitPaymentRequest).toHaveBeenCalledWith(paymentRequest)
    expect(publishSubmitSubscriptionFailed).toHaveBeenCalledWith(paymentRequest, error)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })
})
