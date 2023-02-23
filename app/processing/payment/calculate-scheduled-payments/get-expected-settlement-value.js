const getExpectedSettlementValue = (totalValue, totalPayments, segment) => {
  return Math.trunc(totalValue / totalPayments * segment)
}

module.exports = getExpectedSettlementValue
