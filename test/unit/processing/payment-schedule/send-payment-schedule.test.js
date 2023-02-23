jest.mock('../../../../app/processing/payment-schedule/publish-payment-schedule')
const publishPaymentSchedule = require('../../../../app/processing/payment-schedule/publish-payment-schedule')

const sendPaymentSchedule = require('../../../../app/processing/payment-schedule/send-payment-schedule')

const paymentSchedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-schedule')))

describe('send payment schedule', () => {
  beforeEach(() => {
    publishPaymentSchedule.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call publishStatement', async () => {
    await sendPaymentSchedule(paymentSchedule)
    expect(publishPaymentSchedule).toHaveBeenCalled()
  })

  test('should call publishStatement once', async () => {
    await sendPaymentSchedule(paymentSchedule)
    expect(publishPaymentSchedule).toHaveBeenCalledTimes(1)
  })

  test('should call publishStatement with statement', async () => {
    await sendPaymentSchedule(paymentSchedule)
    expect(publishPaymentSchedule).toHaveBeenCalledWith(paymentSchedule)
  })

  test('should throw when publishStatement rejects ', async () => {
    publishPaymentSchedule.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendPaymentSchedule(paymentSchedule)
    }
    await expect(wrapper).rejects.toThrow()
  })

  test('should throw error when publishStatement rejects ', async () => {
    publishPaymentSchedule.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendPaymentSchedule(paymentSchedule)
    }
    await expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with message which starts with "Failed to send payment schedule for FRN" when publishStatement rejects', async () => {
    publishPaymentSchedule.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendPaymentSchedule(paymentSchedule)
    }
    await expect(wrapper).rejects.toThrow(`Failed to send payment schedule for ${paymentSchedule.frn}`)
  })
})
