const isFirstPayment = (invoiceNumber) => {
  return invoiceNumber?.toString().endsWith('001')
}

module.exports = isFirstPayment
