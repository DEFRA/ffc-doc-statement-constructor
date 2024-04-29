const moment = require('moment')
const number1 = 1
const number3 = 3
const number4 = 4
const number12 = 12
const { DAX_CODES } = require('../../../constants/schedules')
const getSchedule = require('./get-schedule')
const getSettledValue = require('./get-settled-value')

const calculateScheduledPayments = ({ paymentRequest, previousSettlements = [], previousValue = 0, currentDate = new Date() }) => {
  const settledValue = getSettledValue(previousSettlements)
  const totalValue = previousValue === 0 ? paymentRequest.value : previousValue

  const scheduleDate = moment(paymentRequest.dueDate, 'DD/MM/YYYY')

  const scheduleData = { scheduleDate, currentDate }
  const valueData = { settledValue, totalValue }

  switch (paymentRequest.schedule) {
    case DAX_CODES.QUARTERLY:
      return getSchedule({ ...scheduleData, totalPayments: number4, increment: number3, unit: 'month' }, valueData)
    case DAX_CODES.MONTHLY:
      return getSchedule({ ...scheduleData, totalPayments: number12, increment: number1, unit: 'month' }, valueData)
    case DAX_CODES.THREE_DAY_QUARTERLY:
      return getSchedule({ ...scheduleData, totalPayments: number4, increment: number3, unit: 'day' }, valueData)
    default:
      throw new Error(`Unknown schedule ${paymentRequest.schedule}`)
  }
}

module.exports = calculateScheduledPayments
