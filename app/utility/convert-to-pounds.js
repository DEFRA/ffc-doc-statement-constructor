const convertToPounds = (valueInPence) => {
  return (Math.ceil(valueInPence ?? 0) / 100).toFixed(2)
}

module.exports = convertToPounds
