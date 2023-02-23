const getSettledValue = (previousSettlements) => {
  return previousSettlements.reduce((total, settlement) => total + settlement.value, 0)
}

module.exports = getSettledValue
