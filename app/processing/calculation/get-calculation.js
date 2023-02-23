const getCalculationByPaymentRequestId = require('./get-calculation-by-payment-request-id')
const updateCalculationPaymentRequestId = require('./update-calculation-payment-request-id')
const validateCalculation = require('./validate-calculation')
const mapCalculation = require('./map-calculation')

const getCalculation = async (paymentRequestId, invoiceNumber, transaction) => {
  const rawCalculation = await getCalculationByPaymentRequestId(paymentRequestId, transaction)
  const calculation = rawCalculation || await updateCalculationPaymentRequestId(invoiceNumber, paymentRequestId, transaction)
  return mapCalculation(validateCalculation(calculation, paymentRequestId))
}

module.exports = getCalculation
