const validateStatement = (statement) => {
  return hasPaymentValue(statement.payments)
}

const hasPaymentValue = (payments) => {
  const hasPaymentValue = payments[0].value > 0

  if (!hasPaymentValue) {
    console.log(`Skipping construction of zero value payment for ${payments[0].invoiceNumber}`)
    return false
  }
  return true
}

module.exports = validateStatement
