const moment = require('moment')
const { DAX_CODES } = require('../../../../app/constants/schedules')
const getSchedule = require('../../../../app/processing/payment/calculate-scheduled-payments/get-schedule')
const getSettledValue = require('../../../../app/processing/payment/calculate-scheduled-payments/get-settled-value')
const calculateScheduledPayments = require('../../../../app/processing/payment/calculate-scheduled-payments/calculate-scheduled-payments')

jest.mock('../../../../app/processing/payment/calculate-scheduled-payments/get-schedule')
jest.mock('../../../../app/processing/payment/calculate-scheduled-payments/get-settled-value')

describe('calculateScheduledPayments', () => {
  beforeEach(() => {
    getSchedule.mockClear()
    getSettledValue.mockClear()
  })

  test('should handle QUARTERLY schedule', () => {
    getSettledValue.mockReturnValue(100)
    const paymentRequest = {
      schedule: DAX_CODES.QUARTERLY,
      value: 200,
      dueDate: '01/01/2022'
    }
    calculateScheduledPayments(paymentRequest)
    expect(getSchedule).toHaveBeenCalledWith(moment(paymentRequest.dueDate, 'DD/MM/YYYY'), 4, 100, 200, 3, 'month', expect.any(Date))
  })

  test('should handle MONTHLY schedule', () => {
    getSettledValue.mockReturnValue(100)
    const paymentRequest = {
      schedule: DAX_CODES.MONTHLY,
      value: 200,
      dueDate: '01/01/2022'
    }
    calculateScheduledPayments(paymentRequest)
    expect(getSchedule).toHaveBeenCalledWith(moment(paymentRequest.dueDate, 'DD/MM/YYYY'), 12, 100, 200, 1, 'month', expect.any(Date))
  })

  test('should handle THREE_DAY_QUARTERLY schedule', () => {
    getSettledValue.mockReturnValue(100)
    const paymentRequest = {
      schedule: DAX_CODES.THREE_DAY_QUARTERLY,
      value: 200,
      dueDate: '01/01/2022'
    }
    calculateScheduledPayments(paymentRequest)
    expect(getSchedule).toHaveBeenCalledWith(moment(paymentRequest.dueDate, 'DD/MM/YYYY'), 4, 100, 200, 3, 'day', expect.any(Date))
  })

  test('should throw error for unknown schedule', () => {
    const paymentRequest = {
      schedule: 'UNKNOWN',
      value: 200,
      dueDate: '01/01/2022'
    }
    expect(() => calculateScheduledPayments(paymentRequest)).toThrow(`Unknown schedule ${paymentRequest.schedule}`)
  })
})
