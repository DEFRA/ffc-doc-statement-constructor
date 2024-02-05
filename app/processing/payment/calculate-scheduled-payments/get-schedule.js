const getExpectedSettlementValue = require('./get-expected-settlement-value')
const getExpectedValue = require('./get-expected-value')
const getPeriod = require('./get-period')

const getSchedule = (scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate) => {
  const scheduleDates = []
  for (let i = 1; i <= totalPayments; i++) {
    const expectedValue = getExpectedValue(totalValue, totalPayments, i === totalPayments)
    const expectedSettlementValue = getExpectedSettlementValue(totalValue, totalPayments, i)
    const cappedSettlementValue = settledValue <= expectedSettlementValue ? settledValue : expectedSettlementValue
    scheduleDates.push({
      dueDate: scheduleDate.clone(),
      period: getPeriod(scheduleDate, increment, unit),
      value: expectedValue,
      outstanding: scheduleDate >= currentDate || cappedSettlementValue < expectedSettlementValue
    })
    scheduleDate = scheduleDate.add(increment, unit)
  }

  return scheduleDates
}

module.exports = getSchedule
