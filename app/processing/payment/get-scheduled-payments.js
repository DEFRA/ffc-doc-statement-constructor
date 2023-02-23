const moment = require('moment')
const { DAX_CODES } = require('../../constants/schedules')
const getSchedule = require('./get-schedule')

const getPaymentSchedule = (schedule, dueDate, paymentValue, settledValue, previousSettledValue, totalValue, currentDate) => {
  const scheduleDate = moment(dueDate, 'DD/MM/YYYY')

  switch (schedule) {
    case DAX_CODES.QUARTERLY:
      return getSchedule(scheduleDate, 4, paymentValue, settledValue, previousSettledValue, totalValue, 3, 'month', currentDate)
    case DAX_CODES.MONTHLY:
      return getSchedule(scheduleDate, 12, paymentValue, settledValue, previousSettledValue, totalValue, 1, 'month', currentDate)
    case DAX_CODES.THREE_DAY_QUARTERLY:
      return getSchedule(scheduleDate, 4, paymentValue, settledValue, previousSettledValue, totalValue, 3, 'day', currentDate)
    default:
      throw new Error(`Unknown schedule ${schedule}`)
  }
}

module.exports = getPaymentSchedule
