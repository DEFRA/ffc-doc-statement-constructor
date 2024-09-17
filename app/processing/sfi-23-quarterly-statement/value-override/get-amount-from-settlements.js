const util = require('util')
const { getLatestInProgressPaymentRequest } = require('../../payment-request')
const { getSupportingSettlements, updateSettlementPaymentRequestId } = require('../../settlement')
const getLatestPaymentValue = require('./get-latest-payment-value')
const getPreviousSettlement = require('./get-previous-settlement')
const getSettlementByPaymentReference = require('./get-settlement-by-payment-reference')

const getAmountFromSettlements = async (reference) => {
  const settlement = await getSettlementByPaymentReference(reference)
  const settlementWithPaymentRequestId = settlement.paymentRequestId ? settlement : await updateSettlementPaymentRequestId(settlement)
  const previousSettlement = await getPreviousSettlement(settlementWithPaymentRequestId.settlementDate, settlementWithPaymentRequestId.value, settlementWithPaymentRequestId.invoiceNumber, settlementWithPaymentRequestId.reference)
  console.log('Previous settlement:', util.inspect(previousSettlement, false, null, true))
  if (previousSettlement?.value) {
    settlementWithPaymentRequestId.value -= previousSettlement.value
  }
  console.log('Current settlement:', util.inspect(settlementWithPaymentRequestId, false, null, true))
  const latestPaymentRequest = await getLatestInProgressPaymentRequest(settlementWithPaymentRequestId.paymentRequestId, settlementWithPaymentRequestId.settlementDate)
  console.log('Latest payment request:', util.inspect(latestPaymentRequest, false, null, true))
  const supportingSettlements = await getSupportingSettlements(settlementWithPaymentRequestId.settlementDate, latestPaymentRequest.agreementNumber, latestPaymentRequest.year)
  console.log('Supporting settlements:', util.inspect(supportingSettlements, false, null, true))
  return getLatestPaymentValue(settlementWithPaymentRequestId, supportingSettlements)
}

module.exports = {
  getAmountFromSettlements
}
