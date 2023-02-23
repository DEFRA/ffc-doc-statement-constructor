const db = require('../../data')
const { IN_PROGRESS } = require('../../constants/statuses')

const getInProgressPaymentRequestByInvoiceNumber = async (invoiceNumber, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    lock: true,
    where: {
      invoiceNumber,
      status: IN_PROGRESS
    }
  })
}

module.exports = getInProgressPaymentRequestByInvoiceNumber
