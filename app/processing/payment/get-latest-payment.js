const moment = require('moment')
const getScheduledPayments = require('./get-scheduled-payments')
const validateLatestPayment = require('./validate-latest-payment')

const getLatestPayment = (paymentRequest, settlement, supportingSettlements) => {
  const supportingPaymentValue = supportingSettlements?.reduce((total, settlement) => total + settlement.paymentValue, 0) ?? 0
  const adjustedPaymentValue = settlement.paymentValue + supportingPaymentValue

  const latestPayment = {
    invoiceNumber: settlement.invoiceNumber,
    dueDate: paymentRequest.dueDate,
    value: adjustedPaymentValue,
    period: paymentRequest.schedule
      ? getScheduledPayments(paymentRequest.schedule, paymentRequest.dueDate, settlement.paymentValue, settlement.value, settlement.lastSettlementValue, paymentRequest.originalValue, settlement.settlementDate)
      : `${moment(paymentRequest.dueDate).format('MMMM YYYY')}`
  }

  return validateLatestPayment(latestPayment)
}

module.exports = getLatestPayment
