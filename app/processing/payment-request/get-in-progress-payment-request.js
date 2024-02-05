const db = require('../../data')
const { IN_PROGRESS } = require('../../constants/statuses')

const getInProgressPaymentRequest = async (correlationId, transaction) => {
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
      'sourceSystem',
      'value'
    ],
    where: {
      correlationId,
      status: IN_PROGRESS
    },
    raw: true
  })
}

module.exports = getInProgressPaymentRequest
