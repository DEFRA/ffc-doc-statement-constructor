const getPeriodFromSchedule = (totalValue, totalPayments, paymentValue, schedule, increment, unit) => {
  const incrementValue = Math.trunc(totalValue / totalPayments)
  const incrementsInPayment = Math.trunc((paymentValue / incrementValue) - 1)
  const firstPeriodIndex = schedule.findIndex(x => x.outstanding)
  const firstPayment = schedule[firstPeriodIndex]
  const lastPayment = schedule[firstPeriodIndex + incrementsInPayment]
  const firstPeriod = firstPayment.dueDate.clone().subtract(increment, unit)
  const lastPeriod = lastPayment.dueDate.clone().subtract(1, unit)
  return `${firstPeriod.format('MMMM YYYY')} - ${lastPeriod.format('MMMM YYYY')}`
}

module.exports = getPeriodFromSchedule
