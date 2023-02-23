const db = require('../../data')
const getCalculationByInvoiceNumber = require('./get-calculation-by-invoice-number')
const { reverseEngineerInvoiceNumber } = require('../../utility')

const updateCalculationPaymentRequestId = async (invoiceNumber, paymentRequestId, transaction) => {
  const reversedInvoiceNumber = reverseEngineerInvoiceNumber(invoiceNumber)
  const calculation = await getCalculationByInvoiceNumber(reversedInvoiceNumber, transaction)

  if (calculation) {
    await db.calculation.update({ paymentRequestId }, {
      transaction,
      lock: true,
      where: {
        invoiceNumber: reversedInvoiceNumber
      }
    })

    calculation.paymentRequestId = paymentRequestId
  }

  return calculation
}

module.exports = updateCalculationPaymentRequestId
