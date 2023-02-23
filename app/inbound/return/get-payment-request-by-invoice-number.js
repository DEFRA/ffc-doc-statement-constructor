const db = require('../../data')
const { COMPLETED } = require('../../constants/statuses')

const getPaymentRequestbyInvoiceNumber = async (invoiceNumber, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    lock: true,
    where: {
      invoiceNumber,
      status: COMPLETED
    }
  })
}

module.exports = getPaymentRequestbyInvoiceNumber
