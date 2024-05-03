const validateStatement = (statement) => {
  return validatePaymentValue(statement.payments)
}

const validatePaymentValue = (payments) => {
  const isPaymentValueNonZero = payments[0].value > 0

  if (!isPaymentValueNonZero) {
    console.log(`Skipping construction of zero value payment for ${payments[0].invoiceNumber}`)
    return false
  }
  return true
}

module.exports = validateStatement
