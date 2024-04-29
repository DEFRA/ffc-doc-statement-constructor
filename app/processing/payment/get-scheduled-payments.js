const moment = require('moment')
const { DAX_CODES } = require('../../constants/schedules')
const getSchedule = require('./get-schedule')
const number1 = 1
const number3 = 3
const number4 = 4
const number12 = 12

const getPaymentSchedule = ({ schedule, dueDate, currentDate }, { paymentValue, settledValue, previousSettledValue, totalValue }) => {
  const scheduleDate = moment(dueDate, 'DD/MM/YYYY')

  const scheduleData = { scheduleDate, currentDate }

  switch (schedule) {
    case DAX_CODES.QUARTERLY:
      return getSchedule({ ...scheduleData, totalPayments: number4, increment: number3, unit: 'month' }, { paymentValue, settledValue, previousSettledValue, totalValue })
    case DAX_CODES.MONTHLY:
      return getSchedule({ ...scheduleData, totalPayments: number12, increment: number1, unit: 'month' }, { paymentValue, settledValue, previousSettledValue, totalValue })
    case DAX_CODES.THREE_DAY_QUARTERLY:
      return getSchedule({ ...scheduleData, totalPayments: number4, increment: number3, unit: 'day' }, { paymentValue, settledValue, previousSettledValue, totalValue })
    default:
      throw new Error(`Unknown schedule ${schedule}`)
  }
}

module.exports = getPaymentSchedule
