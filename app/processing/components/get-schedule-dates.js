const moment = require('moment')
const { convertToPounds } = require('../../utility')
const { IMMEDIATE, QUARTERLY } = require('../../../app/constants/payment-type')

const getScheduleDates = (previousPaymentSchedule, newPaymentSchedule, deltaValue) => {
  if (previousPaymentSchedule.every(x => x.outstanding)) {
    return mapSchedule(newPaymentSchedule)
  }

  const paidSegments = previousPaymentSchedule.filter(x => !x.outstanding)
  newPaymentSchedule.splice(0, paidSegments.length)
  const nonAdjustmentValue = 0

  if (deltaValue < nonAdjustmentValue) {
    // we need to avoid a balloon reduction, so we spread the reduction for any paid segments across remaining segments only
    const correctionValue = ((Math.abs(deltaValue) / previousPaymentSchedule.length) * paidSegments.length) / newPaymentSchedule.length
    newPaymentSchedule.forEach(x => { x.value = x.value - correctionValue < 0 ? 0 : x.value - correctionValue })
  }
  if (deltaValue > nonAdjustmentValue) {
    newPaymentSchedule.unshift({
      paymentType: IMMEDIATE,
      period: moment().format('MMMM YYYY'),
      value: Math.trunc((deltaValue / previousPaymentSchedule.length) * paidSegments.length)
    })
  }

  return mapSchedule(newPaymentSchedule)
}

const mapSchedule = (schedule) => {
  return schedule.map((segment, i) => ({
    order: i + 1,
    dueDate: segment.dueDate?.format('DD/MM/YYYY'),
    paymentType: segment.paymentType ?? QUARTERLY,
    period: segment.period,
    value: convertToPounds(segment.value)
  }))
}

module.exports = getScheduleDates
