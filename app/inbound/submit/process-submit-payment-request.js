const db = require('../../data')

const { COMPLETED } = require('../../constants/statuses')

const getCompletedPaymentRequestByReferenceId = require('./get-completed-payment-request-by-reference-id')
const saveInvoiceNumber = require('../save-invoice-number')
const savePaymentRequest = require('../save-payment-request')
const saveInvoiceLines = require('../save-invoice-lines')
const saveSchedule = require('./save-schedule')
const shouldTriggerPaymentSchedule = require('./should-trigger-payment-schedule')
const config = require('../../config').processingConfig

const processSubmitPaymentRequest = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingPaymentRequest = await getCompletedPaymentRequestByReferenceId(paymentRequest.referenceId, transaction)
    if (existingPaymentRequest) {
      console.info(`Duplicate submit payment request received, skipping ${existingPaymentRequest.referenceId}`)

      const hoursLimit = config.hoursLimit
      const receivedDate = new Date(existingPaymentRequest.received)
      const currentDate = new Date()
      const hoursDifference = Math.abs(currentDate - receivedDate) / 36e5

      if (hoursDifference > hoursLimit) {
        console.error(`Payment request ${existingPaymentRequest.invoiceNumber} was received more than ${hoursLimit} hours ago.`)
        throw new Error(`Payment request ${existingPaymentRequest.invoiceNumber} was received more than ${hoursLimit} hours ago.`)
      }

      await transaction.rollback()
    } else {
      await saveInvoiceNumber(paymentRequest.invoiceNumber, transaction)
      const savedPaymentRequest = await savePaymentRequest({ ...paymentRequest, status: COMPLETED }, transaction)
      await saveInvoiceLines(paymentRequest.invoiceLines, savedPaymentRequest.paymentRequestId, transaction)
      if (shouldTriggerPaymentSchedule(paymentRequest)) {
        await saveSchedule(savedPaymentRequest.paymentRequestId, transaction)
      }
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processSubmitPaymentRequest
