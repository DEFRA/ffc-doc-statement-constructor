const getCompletedInvoiceNumbers = require('./get-schedule-supporting-invoice-numbers')
const getLastSettlementByInvoiceNumber = require('./get-last-settlement-by-invoice-number')

const getScheduleSupportingSettlements = async (previousPaymentRequests, transaction) => {
  const supportingSettlements = []
  for (const paymentRequest of previousPaymentRequests) {
    const completedInvoiceNumbers = await getCompletedInvoiceNumbers(paymentRequest.paymentRequestNumber, paymentRequest.agreementNumber, paymentRequest.marketingYear, transaction)
    for (const completedInvoiceNumber of completedInvoiceNumbers) {
      const lastSettlement = await getLastSettlementByInvoiceNumber(completedInvoiceNumber, transaction)
      supportingSettlements.push(lastSettlement)
    }
  }
  return supportingSettlements
}

module.exports = getScheduleSupportingSettlements
