const getPaymentFromSchedule = require('../../../../app/processing/payment/get-period-from-schedule')
const moment = require('moment')

let totalValue
let totalPayments
let paymentValue
let schedule
let increment
let unit

describe('get period from schedule', () => {
  test('returns first instalment when only first paid and quarterly', () => {
    totalValue = 1000
    totalPayments = 4
    paymentValue = 250
    schedule = [
      { outstanding: true, dueDate: moment('2022-01-01') },
      { outstanding: true, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-10-01') }
    ]
    increment = 3
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('October to December 2021')
  })

  test('returns first instalment when only second paid and quarterly', () => {
    totalValue = 1000
    totalPayments = 4
    paymentValue = 250
    schedule = [
      { outstanding: false, dueDate: moment('2022-01-01') },
      { outstanding: true, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-10-01') }
    ]
    increment = 3
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('January to March 2022')
  })

  test('returns first instalment when only third paid and quarterly', () => {
    totalValue = 1000
    totalPayments = 4
    paymentValue = 250
    schedule = [
      { outstanding: false, dueDate: moment('2022-01-01') },
      { outstanding: false, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-10-01') }
    ]
    increment = 3
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('April to June 2022')
  })

  test('returns first instalment when only fourth paid and quarterly', () => {
    totalValue = 1000
    totalPayments = 4
    paymentValue = 250
    schedule = [
      { outstanding: false, dueDate: moment('2022-01-01') },
      { outstanding: false, dueDate: moment('2022-04-01') },
      { outstanding: false, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-10-01') }
    ]
    increment = 3
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('July to September 2022')
  })

  test('returns first two instalments when first two paid and quarterly', () => {
    totalValue = 1000
    totalPayments = 4
    paymentValue = 500
    schedule = [
      { outstanding: true, dueDate: moment('2022-01-01') },
      { outstanding: true, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-10-01') }
    ]
    increment = 3
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('October to March 2022')
  })

  test('returns first three instalments when first three paid and quarterly', () => {
    totalValue = 1000
    totalPayments = 4
    paymentValue = 750
    schedule = [
      { outstanding: true, dueDate: moment('2022-01-01') },
      { outstanding: true, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-10-01') }
    ]
    increment = 3
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('October to June 2022')
  })

  test('returns first four instalments when first four paid and quarterly', () => {
    totalValue = 1000
    totalPayments = 4
    paymentValue = 1000
    schedule = [
      { outstanding: true, dueDate: moment('2022-01-01') },
      { outstanding: true, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-10-01') }
    ]
    increment = 3
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('October to September 2022')
  })

  test('returns second and third instalments when second and third paid and quarterly', () => {
    totalValue = 1000
    totalPayments = 4
    paymentValue = 500
    schedule = [
      { outstanding: false, dueDate: moment('2022-01-01') },
      { outstanding: true, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-10-01') }
    ]
    increment = 3
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('January to June 2022')
  })

  test('returns second, third and fourth instalments when second, third and fourth paid and quarterly', () => {
    totalValue = 1000
    totalPayments = 4
    paymentValue = 750
    schedule = [
      { outstanding: false, dueDate: moment('2022-01-01') },
      { outstanding: true, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-10-01') }
    ]
    increment = 3
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('January to September 2022')
  })

  test('returns third and fourth instalments when third and fourth paid and quarterly', () => {
    totalValue = 1000
    totalPayments = 4
    paymentValue = 500
    schedule = [
      { outstanding: false, dueDate: moment('2022-01-01') },
      { outstanding: false, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-10-01') }
    ]
    increment = 3
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('April to September 2022')
  })

  test('returns first instalment when only second paid and monthly', () => {
    totalValue = 1200
    totalPayments = 12
    paymentValue = 100
    schedule = [
      { outstanding: false, dueDate: moment('2022-01-01') },
      { outstanding: true, dueDate: moment('2022-02-01') },
      { outstanding: true, dueDate: moment('2022-03-01') },
      { outstanding: true, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-05-01') },
      { outstanding: true, dueDate: moment('2022-06-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-08-01') },
      { outstanding: true, dueDate: moment('2022-09-01') },
      { outstanding: true, dueDate: moment('2022-10-01') },
      { outstanding: true, dueDate: moment('2022-11-01') },
      { outstanding: true, dueDate: moment('2022-12-01') }
    ]
    increment = 1
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('January to January 2022')
  })

  test('returns third instalments when only third paid and monthly', () => {
    totalValue = 1200
    totalPayments = 12
    paymentValue = 100
    schedule = [
      { outstanding: false, dueDate: moment('2022-01-01') },
      { outstanding: false, dueDate: moment('2022-02-01') },
      { outstanding: true, dueDate: moment('2022-03-01') },
      { outstanding: true, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-05-01') },
      { outstanding: true, dueDate: moment('2022-06-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-08-01') },
      { outstanding: true, dueDate: moment('2022-09-01') },
      { outstanding: true, dueDate: moment('2022-10-01') },
      { outstanding: true, dueDate: moment('2022-11-01') },
      { outstanding: true, dueDate: moment('2022-12-01') }
    ]
    increment = 1
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('February to February 2022')
  })

  test('returns first and second instalments when only first and second paid and monthly', () => {
    totalValue = 1200
    totalPayments = 12
    paymentValue = 200
    schedule = [
      { outstanding: true, dueDate: moment('2022-01-01') },
      { outstanding: true, dueDate: moment('2022-02-01') },
      { outstanding: true, dueDate: moment('2022-03-01') },
      { outstanding: true, dueDate: moment('2022-04-01') },
      { outstanding: true, dueDate: moment('2022-05-01') },
      { outstanding: true, dueDate: moment('2022-06-01') },
      { outstanding: true, dueDate: moment('2022-07-01') },
      { outstanding: true, dueDate: moment('2022-08-01') },
      { outstanding: true, dueDate: moment('2022-09-01') },
      { outstanding: true, dueDate: moment('2022-10-01') },
      { outstanding: true, dueDate: moment('2022-11-01') },
      { outstanding: true, dueDate: moment('2022-12-01') }
    ]
    increment = 1
    unit = 'month'
    const result = getPaymentFromSchedule(totalValue, totalPayments, paymentValue, schedule, increment, unit)
    expect(result).toBe('December to January 2022')
  })
})
