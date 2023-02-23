const db = require('../../data')

const { COMPLETED } = require('../../constants/statuses')

const getCompletedPaymentRequestByInvoiceNumber = async (invoiceNumber, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    where: {
      invoiceNumber,
      status: COMPLETED
    }
  })
}

module.exports = getCompletedPaymentRequestByInvoiceNumber
