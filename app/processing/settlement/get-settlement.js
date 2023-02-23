const getSettledSettlementBySettlementId = require('./get-settled-settlement-by-settlement-id')
const validateSettlement = require('./validate-settlement')
const updateSettlementPaymentRequestId = require('./update-settlement-payment-request-id')
const getLastSettlement = require('./get-last-settlement')
const getPaymentValue = require('./get-payment-value')

const getSettlement = async (settlementId, transaction) => {
  const settledSettlement = await getSettledSettlementBySettlementId(settlementId, transaction)
  const settledSettlementWithPaymentRequestId = settledSettlement.paymentRequestId ? settledSettlement : await updateSettlementPaymentRequestId(settledSettlement, transaction)
  const lastSettlement = await getLastSettlement(settledSettlementWithPaymentRequestId.settlementDate, settledSettlementWithPaymentRequestId.value, settledSettlementWithPaymentRequestId.invoiceNumber, transaction)
  settledSettlementWithPaymentRequestId.lastSettlementValue = lastSettlement?.value ?? 0
  settledSettlementWithPaymentRequestId.paymentValue = getPaymentValue(settledSettlementWithPaymentRequestId.value, lastSettlement?.value)
  return validateSettlement(settledSettlementWithPaymentRequestId)
}

module.exports = getSettlement
