const { convertToPounds } = require('../../app/utility')

const {
  IMMEDIATE,
  QUARTERLY
} = require('../../app/constants/payment-type')

const {
  processingPaymentRequest,
  topUpProcessingPaymentRequest
} = require('./mock-payment-request')

module.exports = [{
  dueDate: undefined,
  order: 1,
  paymentType: IMMEDIATE,
  period: 'May 2023',
  value: convertToPounds(2 * (topUpProcessingPaymentRequest.value - processingPaymentRequest.value) / 4)
},
{
  dueDate: '01/06/2023',
  order: 2,
  paymentType: QUARTERLY,
  period: 'March 2023 - May 2023',
  value: convertToPounds(topUpProcessingPaymentRequest.value / 4)
},
{
  dueDate: '01/09/2023',
  order: 3,
  paymentType: QUARTERLY,
  period: 'June 2023 - August 2023',
  value: convertToPounds(topUpProcessingPaymentRequest.value / 4)
}]
