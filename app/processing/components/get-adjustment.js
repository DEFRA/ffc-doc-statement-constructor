const { convertToPounds } = require('../../utility')

const getAdjustment = (previousValue, newValue, adjustmentValue) => {
  return {
    currentValue: convertToPounds(previousValue),
    newValue: convertToPounds(newValue),
    adjustmentValue: convertToPounds(adjustmentValue)
  }
}

module.exports = getAdjustment
