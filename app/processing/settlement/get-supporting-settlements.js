const getCompletedInvoiceNumbers = require('./get-supporting-invoice-numbers')
const getLastSettlement = require('./get-last-settlement')
const getSettlementsByInvoiceNumber = require('./get-settlements-by-invoice-number')
const getPaymentValue = require('./get-payment-value')

const getSupportingSettlements = async (settlementDate, agreementNumber, marketingYear, transaction) => {
  const completedInvoiceNumbers = await getCompletedInvoiceNumbers(settlementDate, agreementNumber, marketingYear, transaction)
  const supportingSettlements = await getSettlementsByInvoiceNumber(settlementDate, completedInvoiceNumbers, transaction)
  for (const supportingSettlement of supportingSettlements) {
    const lastSettlement = await getLastSettlement(supportingSettlement.settlementDate, supportingSettlement.value, supportingSettlement.invoiceNumber, transaction)
    supportingSettlement.lastSettlementValue = lastSettlement?.value ?? 0
    supportingSettlement.paymentValue = getPaymentValue(supportingSettlement.value, lastSettlement?.value)
  }
  return supportingSettlements
}

module.exports = getSupportingSettlements
