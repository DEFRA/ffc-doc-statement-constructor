const getPeriodFromSchedule = require('./get-period-from-schedule')

const getExpectedValue = (totalValue, totalPayments, segment) => {
  return Math.trunc(totalValue / totalPayments * segment)
}

const getSchedule = ({ schedule, payment, settlementDate }) => {
  let { scheduleDate } = schedule
  const { increment, unit } = schedule
  const { totalPayments, paymentValue, settledValue, previousSettledValue, totalValue } = payment

  const scheduleDates = []
  let expectedSettlementValue = 0
  for (let i = 1; i <= totalPayments; i++) {
    expectedSettlementValue = getExpectedValue(totalValue, totalPayments, i)
    const cappedSettlementValue = settledValue <= expectedSettlementValue ? settledValue : expectedSettlementValue
    scheduleDates.push({
      dueDate: scheduleDate.clone(),
      outstanding: cappedSettlementValue > previousSettledValue && cappedSettlementValue <= settledValue
    })
    scheduleDate = scheduleDate.add(increment, unit)
  }

  return getPeriodFromSchedule(totalValue, totalPayments, paymentValue, scheduleDates, increment, unit, settlementDate)
}

module.exports = getSchedule
