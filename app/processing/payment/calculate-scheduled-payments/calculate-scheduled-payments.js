const moment = require('moment')
const { DAX_CODES } = require('../../../constants/schedules')
const getSchedule = require('./get-schedule')
const getSettledValue = require('./get-settlement-value')

const calculateScheduledPayments = (paymentRequest, previousSettlements = [], previousValue = 0, currentDate = new Date()) => {
  const settledValue = getSettledValue(previousSettlements)
  const totalValue = previousValue === 0 ? paymentRequest.value : previousValue

  const scheduleDate = moment(paymentRequest.dueDate, 'DD/MM/YYYY')

  switch (paymentRequest.schedule) {
    case DAX_CODES.QUARTERLY:
      return getSchedule(scheduleDate, 4, settledValue, totalValue, 3, 'month', currentDate)
    case DAX_CODES.MONTHLY:
      return getSchedule(scheduleDate, 12, settledValue, totalValue, 1, 'month', currentDate)
    case DAX_CODES.THREE_DAY_QUARTERLY:
      return getSchedule(scheduleDate, 4, settledValue, totalValue, 3, 'day', currentDate)
    default:
      throw new Error(`Unknown schedule ${paymentRequest.schedule}`)
  }
}

module.exports = calculateScheduledPayments
