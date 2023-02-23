const validatePaymentSchedule = require('../../../../app/processing/payment-schedule/validate-payment-schedule')

let schedule

describe('validate payment schedule', () => {
  beforeEach(() => {
    schedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-schedule')))
  })

  test('should true if valid schedule', async () => {
    const result = validatePaymentSchedule(schedule)
    expect(result).toBe(true)
  })

  test('should return false if payment is adjustment value is 0.00', async () => {
    schedule.adjustment.adjustmentValue = '0.00'
    const result = validatePaymentSchedule(schedule)
    expect(result).toBe(false)
  })

  test('should return true if payment is adjustment value is greater than 0.00', async () => {
    schedule.adjustment.adjustmentValue = '1.00'
    const result = validatePaymentSchedule(schedule)
    expect(result).toBe(true)
  })

  test('should return true if payment is adjustment value is less than 0.00', async () => {
    schedule.adjustment.adjustmentValue = '-1.00'
    const result = validatePaymentSchedule(schedule)
    expect(result).toBe(true)
  })
})
