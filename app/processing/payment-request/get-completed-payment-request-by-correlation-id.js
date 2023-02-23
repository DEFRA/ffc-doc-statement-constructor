const db = require('../../data')
const { COMPLETED } = require('../../constants/statuses')

const getCompletedPaymentRequestByCorrelationId = async (correlationId, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    attributes: [
      'paymentRequestId',
      'agreementNumber',
      'correlationId',
      'dueDate',
      'invoiceNumber',
      'marketingYear',
      'paymentRequestNumber',
      'schedule',
      'value'
    ],
    where: {
      correlationId,
      status: COMPLETED
    },
    raw: true
  })
}

module.exports = getCompletedPaymentRequestByCorrelationId
