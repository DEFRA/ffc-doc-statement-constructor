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
      payment.totalPayments = number4
      scheduleData.increment = number3
      scheduleData.unit = 'month'
      break
    case DAX_CODES.MONTHLY:
      payment.totalPayments = number12
      scheduleData.increment = number1
      scheduleData.unit = 'month'
      break
    case DAX_CODES.THREE_DAY_QUARTERLY:
      payment.totalPayments = number4
      scheduleData.increment = number3
      scheduleData.unit = 'day'
      break
    default:
      throw new Error(`Unknown schedule ${schedule}`)
  }

  return getSchedule({ schedule: scheduleData, payment, settlementDate: currentDate })
}

module.exports = getPaymentSchedule
