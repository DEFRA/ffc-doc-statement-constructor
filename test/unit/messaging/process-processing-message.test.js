jest.mock('ffc-messaging')
jest.mock('../../../app/inbound')
jest.mock('../../../app/messaging/publish-process-subscription-failed')

const { processProcessingPaymentRequest } = require('../../../app/inbound')
const publishProcessSubscriptionFailed = require('../../../app/messaging/publish-process-subscription-failed')
const processProcessingMessage = require('../../../app/messaging/process-processing-message')

let receiver
let paymentRequest
let message

describe('process processing message', () => {
  beforeEach(() => {
    processProcessingPaymentRequest.mockReturnValue(undefined)
    publishProcessSubscriptionFailed.mockReturnValue(undefined)

    paymentRequest = JSON.parse(JSON.stringify(require('../../mock-objects/mock-payment-request').processingPaymentRequest))

    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }

    message = { body: paymentRequest }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call processProcessingPaymentRequest when nothing throws', async () => {
    await processProcessingMessage(message, receiver)
    expect(processProcessingPaymentRequest).toHaveBeenCalledWith(paymentRequest)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should call processProcessingPaymentRequest once when nothing throws', async () => {
    await processProcessingMessage(message, receiver)
    expect(processProcessingPaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call processProcessingPaymentRequest with paymentRequest when nothing throws', async () => {
    await processProcessingMessage(message, receiver)
    expect(processProcessingPaymentRequest).toHaveBeenCalledWith(paymentRequest)
  })

  test('should not throw when processProcessingPaymentRequest throws', async () => {
    processProcessingPaymentRequest.mockRejectedValue(new Error('Database save issue'))

    const wrapper = async () => {
      await processProcessingMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call receiver.completeMessage when nothing throws', async () => {
    await processProcessingMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalled()
  })

  test('should not call receiver.deadLetterMessage when nothing throws', async () => {
    await processProcessingMessage(message, receiver)
    expect(receiver.deadLetterMessage).not.toHaveBeenCalled()
  })

  test('should call receiver.completeMessage once when nothing throws', async () => {
    await processProcessingMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledTimes(1)
  })

  test('should call receiver.completeMessage with message when nothing throws', async () => {
    await processProcessingMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should not call receiver.completeMessage when processProcessingPaymentRequest throws', async () => {
    processProcessingPaymentRequest.mockRejectedValue(new Error('Transaction failed'))
    try { await processProcessingMessage(message, receiver) } catch {}
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })

  test('should call receiver.deadLetterMessage when processProcessingPaymentRequest throws', async () => {
    processProcessingPaymentRequest.mockRejectedValue(new Error('Transaction failed'))
    try { await processProcessingMessage(message, receiver) } catch {}
    expect(receiver.deadLetterMessage).toHaveBeenCalled()
  })

  test('should not throw when processProcessingPaymentRequest throws', async () => {
    processProcessingPaymentRequest.mockRejectedValue(new Error('Transaction failed'))

    const wrapper = async () => {
      await processProcessingMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when receiver.completeMessage throws', async () => {
    receiver.completeMessage.mockRejectedValue(new Error('Azure difficulties'))

    const wrapper = async () => {
      await processProcessingMessage(message, receiver)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call publishProcessSubscriptionFailed and deadLetterMessage on error', async () => {
    const error = new Error('Test error')
    processProcessingPaymentRequest.mockRejectedValue(error)

    await processProcessingMessage(message, receiver)
    expect(processProcessingPaymentRequest).toHaveBeenCalledWith(paymentRequest)
    expect(publishProcessSubscriptionFailed).toHaveBeenCalledWith(paymentRequest, error)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })
})
