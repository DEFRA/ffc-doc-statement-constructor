const validateSfi23AdvancedStatement = (sfi23AdvancedStatement) => {
  return validatePaymentValue(sfi23AdvancedStatement.payments)
}

const validatePaymentValue = (payments) => {
  const isPaymentValueNonZero = payments[0].value > 0

  if (!isPaymentValueNonZero) {
    console.log(`Skipping construction of zero value payment for ${payments[0].invoiceNumber}`)
    return false
  }
  return true
}

module.exports = validateSfi23AdvancedStatement
