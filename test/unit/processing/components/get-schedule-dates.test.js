const moment = require('moment')
const getScheduleDates = require('../../../../app/processing/components/get-schedule-dates')
const { IMMEDIATE, QUARTERLY } = require('../../../../app/constants/payment-type')

let previousPaymentSchedule
let newPaymentScheduleTopUp
let newPaymentScheduleReduction
let deltaValue

describe('get schedule dates', () => {
  beforeEach(() => {
    previousPaymentSchedule = [{
      dueDate: moment('2021-01-01'),
      outstanding: false,
      period: 'Sep-Dec 2020',
      value: 25000
    }, {
      dueDate: moment('2021-04-01'),
      outstanding: false,
      period: 'Jan-Mar 2021',
      value: 25000
    }, {
      dueDate: moment('2021-07-01'),
      outstanding: true,
      period: 'Apr-Jun 2021',
      value: 25000
    }, {
      dueDate: moment('2021-10-01'),
      outstanding: true,
      period: 'Jul-Sep 2021',
      value: 25000
    }]

    newPaymentScheduleTopUp = [{
      dueDate: moment('2021-01-01'),
      outstanding: false,
      period: 'Sep-Dec 2020',
      value: 50000
    }, {
      dueDate: moment('2021-04-01'),
      outstanding: true,
      period: 'Jan-Mar 2021',
      value: 50000
    }, {
      dueDate: moment('2021-07-01'),
      outstanding: true,
      period: 'Apr-Jun 2021',
      value: 50000
    }, {
      dueDate: moment('2021-10-01'),
      outstanding: true,
      period: 'Jul-Sep 2021',
      value: 50000
    }]

    newPaymentScheduleReduction = [{
      dueDate: moment('2021-01-01'),
      outstanding: false,
      period: 'Sep-Dec 2020',
      value: 12500
    }, {
      dueDate: moment('2021-04-01'),
      outstanding: true,
      period: 'Jan-Mar 2021',
      value: 12500
    }, {
      dueDate: moment('2021-07-01'),
      outstanding: true,
      period: 'Apr-Jun 2021',
      value: 12500
    }, {
      dueDate: moment('2021-10-01'),
      outstanding: true,
      period: 'Jul-Sep 2021',
      value: 12500
    }]

    deltaValue = 50000
  })

  test('should return schedule as array', () => {
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleTopUp, deltaValue)
    expect(schedule).toEqual(expect.any(Array))
  })

  test('should return full new schedule if all segments outstanding', () => {
    previousPaymentSchedule.forEach(x => { x.outstanding = true })
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleTopUp, deltaValue)
    expect(schedule.length).toEqual(newPaymentScheduleTopUp.length)
    expect(schedule[0].value).toEqual('500.00')
    expect(schedule[1].value).toEqual('500.00')
    expect(schedule[2].value).toEqual('500.00')
    expect(schedule[3].value).toEqual('500.00')
  })

  test('should insert top up adjustment after last outstanding payment in original schedule', () => {
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleTopUp, deltaValue)
    expect(schedule[0].period).toEqual(moment().format('MMMM YYYY'))
  })

  test('Adjustment payment Type must be Immediate payment', () => {
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleTopUp, deltaValue)
    expect(schedule[0].paymentType).toEqual(IMMEDIATE)
    expect(schedule[0].paymentType).not.toEqual(QUARTERLY)
  })

  test('should not retain previous payment value for paid segments if top up', () => {
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleTopUp, deltaValue)
    expect(schedule[0].paymentType).toEqual(IMMEDIATE)
  })

  test('should calculate new payment value for unpaid segments if top up', () => {
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleTopUp, deltaValue)
    expect(schedule[1].value).toEqual('500.00')
    expect(schedule[2].value).toEqual('500.00')
  })

  test('Non-Adjustment payment Type must be Quarterly Payment', () => {
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleTopUp, deltaValue)
    expect(schedule[1].paymentType).toEqual(QUARTERLY)
    expect(schedule[2].paymentType).toEqual(QUARTERLY)
  })

  test('should calculate top up value for adjustment', () => {
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleTopUp, deltaValue)
    expect(schedule[0].value).toEqual('250.00')
  })

  test('should insert top up as first and only scheduled item when no remaining payments are to be made', () => {
    previousPaymentSchedule.forEach(x => { x.outstanding = false })
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleReduction, deltaValue)
    expect(schedule[0].value).toEqual('500.00')
    expect(schedule.length).toBe(1)
  })

  test('should not insert adjustment into schedule if reduction', () => {
    deltaValue = -25000
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleReduction, deltaValue)
    expect(schedule[0].period).not.toEqual(moment().format('MMMM YYYY'))
    expect(schedule.length).toEqual(newPaymentScheduleReduction.length)
  })

  test('should calculate new payment value for unpaid segments if reduction', () => {
    deltaValue = -25000
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleReduction, deltaValue)
    expect(schedule[0].value).toEqual('62.50')
    expect(schedule[1].value).toEqual('62.50')
  })

  test('should calculate new payment value for unpaid segments if reduction results in zero remaining payments', () => {
    deltaValue = -50000
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleReduction, deltaValue)
    expect(schedule[0].value).toEqual('0.00')
    expect(schedule[1].value).toEqual('0.00')
  })

  test('should not display negative schedule values if recovery', () => {
    deltaValue = -100000
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleReduction, deltaValue)
    expect(schedule[0].value).toEqual('0.00')
    expect(schedule[1].value).toEqual('0.00')
  })
})
