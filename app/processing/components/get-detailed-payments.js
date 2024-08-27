const moment = require('moment')
const { convertToPounds } = require('../../utility')
const dateFormats = [
  'DD/MM/YYYY',
  'ddd MMM DD YYYY HH:mm:ss'
]

const getDetailedPayments = (calculation, latestPayment, settlement) => {
  const payments = []

  const payment = {
    invoiceNumber: latestPayment.invoiceNumber,
    reference: settlement.reference,
    dueDate: formatDate(latestPayment.dueDate),
    settled: formatDate(settlement.settlementDate),
    calculated: formatDate(calculation.calculated),
    value: convertToPounds(latestPayment.value),
    period: latestPayment.period
  }
  payments.push(payment)

  return payments
}

const formatDate = (dateVal) => {
  return moment(dateVal, dateFormats).format('D MMMM YYYY')
}

module.exports = getDetailedPayments
