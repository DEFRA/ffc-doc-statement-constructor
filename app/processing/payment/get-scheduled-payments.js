const moment = require('moment')
const { DAX_CODES } = require('../../constants/schedules')
const getSchedule = require('./get-schedule')
const number1 = 1
const number3 = 3
const number4 = 4
const number12 = 12

const getPaymentSchedule = (schedule, dueDate, paymentValue, settledValue, previousSettledValue, totalValue, currentDate) => {
  const scheduleDate = moment(dueDate, 'DD/MM/YYYY')

  switch (schedule) {
    case DAX_CODES.QUARTERLY:
      return getSchedule(scheduleDate, number4, paymentValue, settledValue, previousSettledValue, totalValue, number3, 'month', currentDate)
    case DAX_CODES.MONTHLY:
      return getSchedule(scheduleDate, number12, paymentValue, settledValue, previousSettledValue, totalValue, number1, 'month', currentDate)
    case DAX_CODES.THREE_DAY_QUARTERLY:
      return getSchedule(scheduleDate, number4, paymentValue, settledValue, previousSettledValue, totalValue, number3, 'day', currentDate)
    default:
      throw new Error(`Unknown schedule ${schedule}`)
  }
}

module.exports = getPaymentSchedule
