const db = require('../../data')
const getCompletedPaymentRequestByInvoiceNumber = require('./get-completed-payment-request-by-invoice-number')

const updateSettlementPaymentRequestId = async (settlement, transaction) => {
  const paymentRequest = await getCompletedPaymentRequestByInvoiceNumber(settlement.invoiceNumber, transaction)

  if (paymentRequest) {
    const { paymentRequestId } = paymentRequest
    await db.settlement.update({ paymentRequestId }, {
      transaction,
      lock: true,
      where: {
        invoiceNumber: settlement.invoiceNumber
      }
    })

    settlement.paymentRequestId = paymentRequestId
  }

  return settlement
}

module.exports = updateSettlementPaymentRequestId
