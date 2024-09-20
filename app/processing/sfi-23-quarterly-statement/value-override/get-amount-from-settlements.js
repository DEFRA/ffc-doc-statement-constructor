const { getLatestInProgressPaymentRequest } = require('../../payment-request')
const { getSupportingSettlements, updateSettlementPaymentRequestId } = require('../../settlement')
const getLatestPaymentValue = require('./get-latest-payment-value')
const getPreviousSettlement = require('./get-previous-settlement')
const getSettlementByPaymentReference = require('./get-settlement-by-payment-reference')

const getAmountFromSettlements = async (reference) => {
  const settlement = await getSettlementByPaymentReference(reference)
  const settlementWithPaymentRequestId = settlement.paymentRequestId ? settlement : await updateSettlementPaymentRequestId(settlement)
  const previousSettlement = await getPreviousSettlement(settlementWithPaymentRequestId.settlementDate, settlementWithPaymentRequestId.value, settlementWithPaymentRequestId.invoiceNumber, settlementWithPaymentRequestId.reference)
  if (previousSettlement?.value) {
    settlementWithPaymentRequestId.value -= previousSettlement.value
  }
  const latestPaymentRequest = await getLatestInProgressPaymentRequest(settlementWithPaymentRequestId.paymentRequestId, settlementWithPaymentRequestId.settlementDate)
  const supportingSettlements = await getSupportingSettlements(settlementWithPaymentRequestId.settlementDate, latestPaymentRequest.agreementNumber, latestPaymentRequest.year)
  return getLatestPaymentValue(settlementWithPaymentRequestId, supportingSettlements)
}

module.exports = {
  getAmountFromSettlements
}
