const db = require('../../data')
const { IN_PROGRESS } = require('../../constants/statuses')
const getInProgressPaymentRequestByInvoiceNumber = require('./get-in-progress-payment-request-by-invoice-number')
const saveInvoiceNumber = require('../save-invoice-number')
const savePaymentRequest = require('../save-payment-request')
const saveInvoiceLines = require('../save-invoice-lines')
const config = require('../../config').processingConfig
const hourInMs = 36e5

const processProcessingPaymentRequest = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingPaymentRequest = await getInProgressPaymentRequestByInvoiceNumber(paymentRequest.invoiceNumber, transaction)
    if (existingPaymentRequest) {
      console.info(`Duplicate processing payment request received, skipping ${existingPaymentRequest.invoiceNumber}`)

      const maxProcessingRequestAgeHours = config.maxProcessingRequestAgeHours
      const receivedDate = new Date(existingPaymentRequest.received)
      const currentDate = new Date()
      const hoursDifference = Math.abs(currentDate - receivedDate) / hourInMs

      if (hoursDifference > maxProcessingRequestAgeHours) {
        console.error(`Payment request ${existingPaymentRequest.invoiceNumber} was received more than ${maxProcessingRequestAgeHours} hours ago.`)
        throw new Error(`Payment request ${existingPaymentRequest.invoiceNumber} was received more than ${maxProcessingRequestAgeHours} hours ago.`)
      }

      await transaction.rollback()
    } else {
      await saveInvoiceNumber(paymentRequest.invoiceNumber, transaction)
      const savedPaymentRequest = await savePaymentRequest({ ...paymentRequest, status: IN_PROGRESS }, transaction)
      await saveInvoiceLines(paymentRequest.invoiceLines, savedPaymentRequest.paymentRequestId, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processProcessingPaymentRequest
