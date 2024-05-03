const moment = require('moment')
const { DAX_CODES } = require('../../../constants/schedules')
const getSchedule = require('./get-schedule')
const getSettledValue = require('./get-settled-value')
const number1 = 1
const number3 = 3
const number4 = 4
const number12 = 12

const calculateScheduledPayments = (paymentRequest, previousSettlements = [], previousValue = 0, currentDate = new Date()) => {
  const settledValue = getSettledValue(previousSettlements)
  const totalValue = previousValue === 0 ? paymentRequest.value : previousValue

  const scheduleDate = moment(paymentRequest.dueDate, 'DD/MM/YYYY')

  switch (paymentRequest.schedule) {
    case DAX_CODES.QUARTERLY:
      return getSchedule(scheduleDate, number4, settledValue, totalValue, number3, 'month', currentDate)
    case DAX_CODES.MONTHLY:
      return getSchedule(scheduleDate, number12, settledValue, totalValue, number1, 'month', currentDate)
    case DAX_CODES.THREE_DAY_QUARTERLY:
      return getSchedule(scheduleDate, number4, settledValue, totalValue, number3, 'day', currentDate)
    default:
      throw new Error(`Unknown schedule ${paymentRequest.schedule}`)
  }
}

module.exports = calculateScheduledPayments
