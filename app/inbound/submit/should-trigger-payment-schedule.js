const { AP } = require('../../constants/ledgers')
const hasValue = require('./has-value')
const isFirstPayment = require('./is-first-payment')

const shouldTriggerPaymentSchedule = (paymentRequest) => {
  return paymentRequest.schedule &&
    !isFirstPayment(paymentRequest.paymentRequestNumber) &&
    hasValue(paymentRequest.value) &&
    paymentRequest.ledger === AP
}

module.exports = shouldTriggerPaymentSchedule
