const db = require('../../data')
const { getInProgressPaymentRequest, getPreviousPaymentRequests, getCompletedPaymentRequestByPaymentRequestId, mapPaymentRequest, getPreviousPaymentRequestsWithPaymentSchedules } = require('../payment-request')
const getCalculation = require('../calculation')
const { getDetails, getAddress, getScheme, getScheduleDates, getAdjustment } = require('../components')
const { calculateScheduledPayments, calculateDelta } = require('../payment')
const { getScheduleSupportingSettlements } = require('../settlement')

const getPaymentSchedule = async (paymentRequestId) => {
  const transaction = await db.sequelize.transaction()
  try {
    const completedPaymentRequest = await getCompletedPaymentRequestByPaymentRequestId(paymentRequestId, transaction)
    const paymentRequest = await getInProgressPaymentRequest(completedPaymentRequest.correlationId, transaction)
    const mappedPaymentRequest = mapPaymentRequest(paymentRequest)
    const previousPaymentRequests = await getPreviousPaymentRequests(mappedPaymentRequest.agreementNumber, mappedPaymentRequest.year, mappedPaymentRequest.paymentRequestNumber, transaction)
    const previousPaymentRequestsWithSchedules = await getPreviousPaymentRequestsWithPaymentSchedules(previousPaymentRequests, transaction)
    const lastPaymentRequest = previousPaymentRequestsWithSchedules[0]
    const supportingSettlements = await getScheduleSupportingSettlements(previousPaymentRequests, transaction)
    const previousPaymentSchedule = calculateScheduledPayments(lastPaymentRequest, supportingSettlements, lastPaymentRequest.value)
    const newPaymentSchedule = calculateScheduledPayments(paymentRequest)
    const deltaValue = calculateDelta(lastPaymentRequest.value, mappedPaymentRequest.value)
    const schedule = getScheduleDates(previousPaymentSchedule, newPaymentSchedule, deltaValue)
    const adjustment = getAdjustment(lastPaymentRequest.value, mappedPaymentRequest.value, deltaValue)
    const calculation = await getCalculation(mappedPaymentRequest.paymentRequestId, mappedPaymentRequest.invoiceNumber, transaction)
    const details = await getDetails(calculation.sbi, transaction)
    const address = await getAddress(calculation.sbi, transaction)
    const scheme = getScheme(mappedPaymentRequest.year, mappedPaymentRequest.frequency, mappedPaymentRequest.agreementNumber)

    await transaction.commit()
    return {
      ...details,
      address,
      scheme,
      adjustment,
      schedule
    }
  } catch (err) {
    await transaction.rollback()
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required data: ${err.message}`)
  }
}

module.exports = getPaymentSchedule
