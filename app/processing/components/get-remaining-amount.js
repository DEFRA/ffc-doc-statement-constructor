const { convertToPounds } = require('../../utility')

const getRemainingAmount = (paymentSchedule, newValue) => {
  const paidSegments = paymentSchedule.filter(x => !x.outstanding)
  const totalAmountPaid = paidSegments.reduce((paidAmount, schedule) => paidAmount + Number(schedule.value), 0)
  return Number(convertToPounds((Number(newValue) - totalAmountPaid)))
}

module.exports = getRemainingAmount
