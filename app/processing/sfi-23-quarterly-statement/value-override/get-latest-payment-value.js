const util = require('util')

const getLatestPaymentValue = (settlement, supportingSettlements) => {
  const supportingPaymentValue = supportingSettlements?.reduce((total, supportingSettlement) => total + supportingSettlement.paymentValue, 0) ?? 0
  console.log('Supporting payment value:', util.inspect(supportingPaymentValue, false, null, true))
  console.log(supportingPaymentValue)
  return (settlement.value + supportingPaymentValue) / 100
}

module.exports = getLatestPaymentValue
