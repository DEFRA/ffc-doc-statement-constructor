const getPaymentValue = (settlementValue, lastSettlementValue = 0) => {
  return settlementValue - lastSettlementValue
}

module.exports = getPaymentValue
