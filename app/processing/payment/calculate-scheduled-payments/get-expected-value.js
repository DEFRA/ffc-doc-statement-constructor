const getExpectedValue = (totalValue, totalPayments, lastSegment = false) => {
  // DAX rounds up each segment value to the nearest whole pound and addresses any variance in final quarter
  // need to replicate that here so that the payment schedule reflects the actual payment value
  const segmentValue = Math.ceil(totalValue / totalPayments)
  return !lastSegment ? segmentValue : Math.trunc(totalValue - (segmentValue * (totalPayments - 1)))
}

module.exports = getExpectedValue
