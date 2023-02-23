const db = require('../../data')
const { COMPLETED } = require('../../constants/statuses')
const { AP } = require('../../constants/ledgers')

const getScheduleSupportingInvoiceNumbers = async (paymentRequestNumber, agreementNumber, marketingYear, transaction) => {
  const completedPaymentRequests = await db.paymentRequest.findAll({
    transaction,
    attributes: ['invoiceNumber'],
    include: [{
      model: db.settlement,
      as: 'settlementsByInvoiceNumber',
      required: true,
      attributes: [],
      where: {
        settled: true
      }
    }],
    where: {
      paymentRequestNumber,
      agreementNumber,
      marketingYear,
      ledger: AP,
      status: COMPLETED
    },
    raw: true
  })
  return completedPaymentRequests.map(paymentRequest => paymentRequest.invoiceNumber)
}

module.exports = getScheduleSupportingInvoiceNumbers
