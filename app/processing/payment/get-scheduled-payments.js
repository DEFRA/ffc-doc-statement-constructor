const moment = require('moment')
const { DAX_CODES } = require('../../constants/schedules')
const getSchedule = require('./get-schedule')
const number1 = 1
const number3 = 3
const number4 = 4
const number12 = 12

const getPaymentSchedule = (schedule, dueDate, paymentValue, settledValue, previousSettledValue, totalValue, currentDate) => {
  const scheduleDate = moment(dueDate, 'DD/MM/YYYY')

  const payment = {
    totalPayments: null,
    paymentValue,
    settledValue,
    previousSettledValue,
    totalValue
  }

  const scheduleData = {
    scheduleDate,
    increment: null,
    unit: null
  }

  switch (schedule) {
    case DAX_CODES.QUARTERLY:
<<<<<<< HEAD
      payment.totalPayments = 4
      scheduleData.increment = 3
      scheduleData.unit = 'month'
      break
    case DAX_CODES.MONTHLY:
      payment.totalPayments = 12
      scheduleData.increment = 1
      scheduleData.unit = 'month'
      break
    case DAX_CODES.THREE_DAY_QUARTERLY:
      payment.totalPayments = 4
      scheduleData.increment = 3
      scheduleData.unit = 'day'
      break
=======
      return getSchedule(scheduleDate, number4, paymentValue, settledValue, previousSettledValue, totalValue, number3, 'month', currentDate)
    case DAX_CODES.MONTHLY:
      return getSchedule(scheduleDate, number12, paymentValue, settledValue, previousSettledValue, totalValue, number1, 'month', currentDate)
    case DAX_CODES.THREE_DAY_QUARTERLY:
      return getSchedule(scheduleDate, number4, paymentValue, settledValue, previousSettledValue, totalValue, number3, 'day', currentDate)
>>>>>>> 2babcfe243e5526042c0817240bd80b3a6fc7d24
    default:
      throw new Error(`Unknown schedule ${schedule}`)
  }

  return getSchedule({ schedule: scheduleData, payment, settlementDate: currentDate })
}

module.exports = getPaymentSchedule
