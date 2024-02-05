const getSettledValue = (previousSettlements) => {
  return previousSettlements.reduce((maximumValue, settlement) => Math.max(maximumValue, settlement.value), 0)
}

module.exports = getSettledValue
