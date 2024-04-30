const moment = require('moment')
const { DAX_CODES } = require('../../../../app/constants/schedules')
const getSchedule = require('../../../../app/processing/payment/get-schedule')
const getPaymentSchedule = require('../../../../app/processing/payment/get-scheduled-payments')

jest.mock('../../../../app/processing/payment/get-schedule')

describe('getPaymentSchedule', () => {
  beforeEach(() => {
    getSchedule.mockClear()
  })

  test('should handle QUARTERLY schedule', () => {
    getPaymentSchedule(DAX_CODES.QUARTERLY, '01/03/2024', 100, 50, 25, 200, moment())
    expect(getSchedule).toHaveBeenCalledWith(moment('01/03/2024', 'DD/MM/YYYY'), 4, 100, 50, 25, 200, 3, 'month', expect.any(moment))
  })

  test('should handle MONTHLY schedule', () => {
    getPaymentSchedule(DAX_CODES.MONTHLY, '01/03/2024', 100, 50, 25, 200, moment())
    expect(getSchedule).toHaveBeenCalledWith(moment('01/03/2024', 'DD/MM/YYYY'), 12, 100, 50, 25, 200, 1, 'month', expect.any(moment))
  })

  test('should handle THREE_DAY_QUARTERLY schedule', () => {
    getPaymentSchedule(DAX_CODES.THREE_DAY_QUARTERLY, '01/03/2024', 100, 50, 25, 200, moment())
    expect(getSchedule).toHaveBeenCalledWith(moment('01/03/2024', 'DD/MM/YYYY'), 4, 100, 50, 25, 200, 3, 'day', expect.any(moment))
  })

  test('should throw an error for unknown schedule', () => {
    expect(() => getPaymentSchedule('UNKNOWN', '01/03/2024', 100, 50, 25, 200, moment())).toThrow('Unknown schedule UNKNOWN')
  })
})
