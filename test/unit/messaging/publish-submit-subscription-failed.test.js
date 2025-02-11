const sendMessage = require('../../../app/messaging/send-message')
const config = require('../../../app/config')
const publishSubmitSubscriptionFailed = require('../../../app/messaging/publish-submit-subscription-failed')
const { SUBMIT_SUBSCRIPTION_FAILED } = require('../../../app/constants/message-types')

jest.mock('../../../app/messaging/send-message')
jest.mock('../../../app/config')

describe('publishSubmitSubscriptionFailed', () => {
  const paymentRequest = {
    frn: 1234567890,
    sbi: 123456789,
    PaymentReference: 'PR123',
    schemeName: 'Scheme Name',
    schemeShortName: 'Scheme Short Name',
    schemeYear: 2022,
    method: 'Email',
    businessName: 'Business Name',
    addressLine1: 'Address Line 1',
    addressLine2: 'Address Line 2',
    addressLine3: 'Address Line 3',
    addressLine4: 'Address Line 4',
    addressLine5: 'Address Line 5',
    postcode: 'AB12 3CD',
    email: 'email@example.com',
    filename: 'filename.pdf',
    deliveryId: '12345',
    received: '2022-07-01T00:00:00Z',
    requested: '2022-07-01T01:00:00Z',
    failed: '2022-07-01T02:00:00Z',
    completed: '2022-07-01T03:00:00Z',
    statusCode: 400,
    reason: 'Bad Request',
    error: 'Invalid data',
    message: 'Data validation failed'
  }

  const error = new Error('Test error')

  beforeEach(() => {
    jest.clearAllMocks()
    config.submitSubscriptionFailed = 'test-queue'
    console.log = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should send message with correct body and type', async () => {
    await publishSubmitSubscriptionFailed(paymentRequest, error)

    const time = {
      id: expect.any(String),
      time: expect.any(Date)
    }

    const expectedBody = {
      data: {
        message: error.message,
        ...paymentRequest
      },
      ...time,
      type: SUBMIT_SUBSCRIPTION_FAILED
    }

    expect(sendMessage).toHaveBeenCalledWith(expectedBody, SUBMIT_SUBSCRIPTION_FAILED, 'test-queue', time)
  })

  test('should handle sendMessage error', async () => {
    const sendMessageError = new Error('Send message failed')
    sendMessage.mockRejectedValue(sendMessageError)

    await expect(publishSubmitSubscriptionFailed(paymentRequest, error)).rejects.toThrow('Send message failed')
  })
})
