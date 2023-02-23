const validatePaymentSchedule = (schedule) => {
  return hasValueChange(schedule)
}

const hasValueChange = (schedule) => {
  if (schedule.adjustment.adjustmentValue === '0.00') {
    console.log(`Skipping construction of schedule without value change ${schedule.frn}`)
    return false
  }
  return true
}

module.exports = validatePaymentSchedule
