const moment = require('moment')
const getScheduleDates = require('../../../../app/processing/components/get-schedule-dates')
let previousPaymentSchedule
let newPaymentScheduleTopUp
let newPaymentScheduleReduction
let deltaValue

describe('get schedule dates', () => {
  beforeEach(() => {
    previousPaymentSchedule = [{
      dueDate: moment('2021-01-01'),
      outstanding: false,
      period: 'September to December 2020',
      value: 25000
    }, {
      dueDate: moment('2021-04-01'),
      outstanding: false,
      period: 'January to March 2021',
      value: 25000
    }, {
      dueDate: moment('2021-07-01'),
      outstanding: true,
      period: 'April to June 2021',
      value: 25000
    }, {
      dueDate: moment('2021-10-01'),
      outstanding: true,
      period: 'July to September 2021',
      value: 25000
    }]

    newPaymentScheduleTopUp = [{
      dueDate: moment('2021-01-01'),
      outstanding: false,
      period: 'September to December 2020',
      value: 50000
    }, {
      dueDate: moment('2021-04-01'),
      outstanding: true,
      period: 'January to March 2021',
      value: 50000
    }, {
      dueDate: moment('2021-07-01'),
      outstanding: true,
      period: 'April to June 2021',
      value: 50000
    }, {
      dueDate: moment('2021-10-01'),
      outstanding: true,
      period: 'July to September 2021',
      value: 50000
    }]

    newPaymentScheduleReduction = [{
      dueDate: moment('2021-01-01'),
      outstanding: false,
      period: 'September to December 2020',
      value: 12500
    }, {
      dueDate: moment('2021-04-01'),
      outstanding: true,
      period: 'January to March 2021',
      value: 12500
    }, {
      dueDate: moment('2021-07-01'),
      outstanding: true,
      period: 'April to June 2021',
      value: 12500
    }, {
      dueDate: moment('2021-10-01'),
      outstanding: true,
      period: 'July to September 2021',
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
    expect(schedule[2].period).toEqual('Adjustment')
  })

  test('should retain previous payment value for paid segments if top up', () => {
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleTopUp, deltaValue)
    expect(schedule[0].value).toEqual('250.00')
    expect(schedule[1].value).toEqual('250.00')
  })

  test('should calculate new payment value for unpaid segments if top up', () => {
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleTopUp, deltaValue)
    expect(schedule[3].value).toEqual('500.00')
    expect(schedule[4].value).toEqual('500.00')
  })

  test('should calculate top up value for adjustment', () => {
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleTopUp, deltaValue)
    expect(schedule[2].value).toEqual('250.00')
  })

  test('should insert top up as last scheduled item no remaining payments', () => {
    previousPaymentSchedule.forEach(x => { x.outstanding = false })
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleReduction, deltaValue)
    expect(schedule[0].value).toEqual('250.00')
    expect(schedule[1].value).toEqual('250.00')
    expect(schedule[2].value).toEqual('250.00')
    expect(schedule[3].value).toEqual('250.00')
    expect(schedule[4].value).toEqual('500.00')
  })

  test('should not insert adjustment into schedule if reduction', () => {
    deltaValue = -25000
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleReduction, deltaValue)
    expect(schedule[2].period).not.toEqual('Adjustment')
    expect(schedule.length).toEqual(previousPaymentSchedule.length)
  })

  test('should retain previous payment value for paid segments if reduction', () => {
    deltaValue = -25000
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleReduction, deltaValue)
    expect(schedule[0].value).toEqual('250.00')
    expect(schedule[1].value).toEqual('250.00')
  })

  test('should calculate new payment value for unpaid segments if reduction', () => {
    deltaValue = -25000
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleReduction, deltaValue)
    expect(schedule[2].value).toEqual('62.50')
    expect(schedule[3].value).toEqual('62.50')
  })

  test('should calculate new payment value for unpaid segments if reduction results in zero remaining payments', () => {
    deltaValue = -50000
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleReduction, deltaValue)
    expect(schedule[2].value).toEqual('0.00')
    expect(schedule[3].value).toEqual('0.00')
  })

  test('should not display negative schedule values if recovery', () => {
    deltaValue = -100000
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentScheduleReduction, deltaValue)
    expect(schedule[2].value).toEqual('0.00')
    expect(schedule[3].value).toEqual('0.00')
  })
})
