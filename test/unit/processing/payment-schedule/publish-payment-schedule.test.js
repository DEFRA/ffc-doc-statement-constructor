const sendMessage = require('../../../../app/messaging/send-message')
jest.mock('../../../../app/messaging/send-message')

const config = require('../../../../app/config')
jest.mock('../../../../app/config')

const type = 'uk.gov.pay.payment.schedule'
const mockPaymentSchedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-schedule')))
const publishPaymentSchedule = require('../../../../app/processing/payment-schedule/publish-payment-schedule')

describe('publish payment-schedule', () => {
  beforeEach(() => {
    config.statementTopic = 'statement-topic'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call sendMessage', async () => {
    await publishPaymentSchedule(mockPaymentSchedule)
    expect(sendMessage).toHaveBeenCalled()
  })

  test('should call sendMessage once', async () => {
    await publishPaymentSchedule(mockPaymentSchedule)
    expect(sendMessage).toHaveBeenCalledTimes(1)
  })

  test('should call sendMessage with mockPaymentSchedule, type and config.statementTopic', async () => {
    await publishPaymentSchedule(mockPaymentSchedule)
    expect(sendMessage).toHaveBeenCalledWith(mockPaymentSchedule, type, config.statementTopic)
  })
})
