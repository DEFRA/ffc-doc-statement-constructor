const getLatestPaymentValue = (settlement, supportingSettlements) => {
  const supportingPaymentValue = supportingSettlements?.reduce((total, supportingSettlement) => total + supportingSettlement.paymentValue, 0) ?? 0
  return (settlement.value + supportingPaymentValue) / 100
}

module.exports = getLatestPaymentValue
