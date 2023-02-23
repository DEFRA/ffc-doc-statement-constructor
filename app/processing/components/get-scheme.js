const getScheme = (year, frequency, agreementNumber) => {
  return {
    name: 'Sustainable Farming Incentive',
    shortName: 'SFI',
    year: String(year),
    frequency,
    agreementNumber
  }
}

module.exports = getScheme
