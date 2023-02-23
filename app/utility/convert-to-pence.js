const convertToPence = (valueInPounds) => {
  const currencyArray = valueInPounds.toString().split('.')
  const pounds = currencyArray[0]
  const pence = (currencyArray[1] || '00').padEnd(2, '0')
  return Number(pounds + pence)
}

module.exports = convertToPence
