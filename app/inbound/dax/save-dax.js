const { dax } = require('../../data')

const saveDax = async (record, transaction) => {
  const { paymentReference, calculationReference, paymentPeriod, paymentAmount, transactionDate, datePublished } = record

  return dax(transaction).insert({
    paymentReference,
    calculationId: calculationReference,
    paymentPeriod,
    paymentAmount,
    transactionDate,
    datePublished
  })
}

module.exports = saveDax
