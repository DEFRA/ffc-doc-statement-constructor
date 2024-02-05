const getPeriod = (scheduleDate, increment, unit) => {
  const firstPeriod = scheduleDate.clone().subtract(increment, unit)
  const lastPeriod = scheduleDate.clone().subtract(1, unit)
  return `${firstPeriod.format('MMMM YYYY')} - ${lastPeriod.format('MMMM YYYY')}`
}

module.exports = getPeriod
