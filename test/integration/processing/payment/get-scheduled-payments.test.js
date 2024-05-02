const moment = require('moment')
const getPaymentSchedule = require('../../../../app/processing/payment/get-scheduled-payments')
const getSchedule = require('../../../../app/processing/payment/get-schedule')
const { DAX_CODES } = require('../../../../app/constants/schedules')

jest.mock('../../../../app/processing/payment/get-schedule')

const dueDate = moment().format('DD/MM/YYYY')
const paymentValue = 100
const settledValue = 50
const previousSettledValue = 25
const totalValue = 200
const currentDate = moment().format('DD/MM/YYYY')

describe('getPaymentSchedule', () => {
  beforeEach(() => {
    getSchedule.mockClear()
  })

  test('should return correct payment schedule for DAX_CODES.MONTHLY', () => {
    getSchedule.mockReturnValue({
      schedule: [{
        dueDate: moment(dueDate, 'DD/MM/YYYY'),
        increment: 1,
        unit: 'month'
      }],
      payment: { totalPayments: 12 }
    })

    const result = getPaymentSchedule(DAX_CODES.MONTHLY, dueDate, paymentValue, settledValue, previousSettledValue, totalValue, currentDate)

    expect(getSchedule).toHaveBeenCalled()
    expect(result.schedule[0]).toHaveProperty('dueDate')
    expect(result.payment.totalPayments).toBe(12)
    expect(result.schedule[0].increment).toBe(1)
    expect(result.schedule[0].unit).toBe('month')
  })

  test('should return correct payment schedule for DAX_CODES.QUARTERLY', () => {
    getSchedule.mockReturnValue({
      schedule: [{
        dueDate: moment(dueDate, 'DD/MM/YYYY'),
        increment: 3,
        unit: 'month'
      }],
      payment: { totalPayments: 4 }
    })

    const result = getPaymentSchedule(DAX_CODES.QUARTERLY, dueDate, paymentValue, settledValue, previousSettledValue, totalValue, currentDate)

    expect(getSchedule).toHaveBeenCalled()
    expect(result.schedule[0]).toHaveProperty('dueDate')
    expect(result.payment.totalPayments).toBe(4)
    expect(result.schedule[0].increment).toBe(3)
    expect(result.schedule[0].unit).toBe('month')
  })

  test('should return correct payment schedule for DAX_CODES.THREE_DAY_QUARTERLY', () => {
    getSchedule.mockReturnValue({
      schedule: [{
        dueDate: moment(dueDate, 'DD/MM/YYYY'),
        increment: 3,
        unit: 'day'
      }],
      payment: { totalPayments: 4 }
    })

    const result = getPaymentSchedule(DAX_CODES.THREE_DAY_QUARTERLY, dueDate, paymentValue, settledValue, previousSettledValue, totalValue, currentDate)

    expect(getSchedule).toHaveBeenCalled()
    expect(result.schedule[0]).toHaveProperty('dueDate')
    expect(result.payment.totalPayments).toBe(4)
    expect(result.schedule[0].increment).toBe(3)
    expect(result.schedule[0].unit).toBe('day')
  })

  test('should throw an error for unknown schedule', () => {
    expect(() => getPaymentSchedule('UNKNOWN', dueDate, paymentValue, settledValue, previousSettledValue, totalValue, currentDate)).toThrow('Unknown schedule UNKNOWN')
  })
})
