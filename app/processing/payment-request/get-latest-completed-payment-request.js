const db = require('../../data')
const { COMPLETED } = require('../../constants/statuses')

const getLatestCompletedPaymentRequest = async (settlementDate, agreementNumber, marketingYear, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    attributes: [
      'agreementNumber',
      'correlationId',
      'marketingYear',
      'paymentRequestNumber'
    ],
    include: [{
      model: db.settlement,
      as: 'settlementsByInvoiceNumber',
      required: true,
      attributes: [],
      where: {
        settlementDate,
        settled: true
      }
    }],
    where: {
      agreementNumber,
      marketingYear,
      status: COMPLETED
    },
    order: [['paymentRequestNumber', 'DESC']],
    raw: true
  })
}

module.exports = getLatestCompletedPaymentRequest
