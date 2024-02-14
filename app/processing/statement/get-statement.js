const db = require('../../data')
const { getDetails, getAddress, getDetailedFunding, getScheme, getDetailedPayments } = require('../components')
const getCalculation = require('../calculation')
const { getLatestInProgressPaymentRequest } = require('../payment-request')
const { getSettlement, getSupportingSettlements } = require('../settlement')
const { getLatestPayment } = require('../payment')
const { SHORT_NAMES } = require('../../constants/scheme-names')
const getPaymentRequestByPaymentRequestId = require('../../inbound/get-payment-request-by-payment-request-id')
const getOrganisationByFrn = require('../organisation/get-organisation-by-frn')
const sfiaGetFunding = require('../components/sfia-hard-coded/sfia-fundings')

const getStatement = async (settlementId, scheduleId) => {
  const transaction = await db.sequelize.transaction()
  try {
    const settlement = await getSettlement(settlementId, transaction)
    const paymentRequest = await getLatestInProgressPaymentRequest(settlement.paymentRequestId, settlement.settlementDate, transaction)
    if (paymentRequest.sourceSystem === SHORT_NAMES.SFIA) {
      const sfiaPaymentRequest = await getPaymentRequestByPaymentRequestId(paymentRequest.paymentRequestId)
      const sfiaOrganisation = await getOrganisationByFrn(sfiaPaymentRequest.frn)
      const sfiaCalculation = { calculated: '05/11/2023', sbi: sfiaOrganisation.sbi }
      const sfiaSbi = sfiaCalculation.sbi
      const sfiaDetails = await getDetails(sfiaSbi, transaction)
      const sfiaAddress = await getAddress(sfiaSbi, transaction)
      const sfiaScheme = await getScheme(paymentRequest.year, paymentRequest.frequency, paymentRequest.agreementNumber, paymentRequest.sourceSystem)
      const supportingSettlements = await getSupportingSettlements(settlement.settlementDate, paymentRequest.agreementNumber, paymentRequest.year, transaction)
      paymentRequest.schedule = 'Q4'
      const latestPayment = getLatestPayment(paymentRequest, settlement, supportingSettlements)
      const sfiaPayments = getDetailedPayments(sfiaCalculation, latestPayment, settlement)
      const sfiaFunding = sfiaGetFunding

      await transaction.commit()
      return {
        ...sfiaDetails,
        address: sfiaAddress,
        funding: sfiaFunding,
        payments: sfiaPayments,
        scheme: sfiaScheme,
        documentReference: scheduleId
      }
    }

    const calculation = await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber, transaction)
    const sbi = calculation.sbi
    const details = await getDetails(sbi, transaction)
    const address = await getAddress(sbi, transaction)
    const funding = await getDetailedFunding(calculation.calculationId, paymentRequest.paymentRequestId, transaction)
    const scheme = await getScheme(paymentRequest.year, paymentRequest.frequency, paymentRequest.agreementNumber, paymentRequest.sourceSystem)
    const supportingSettlements = await getSupportingSettlements(settlement.settlementDate, paymentRequest.agreementNumber, paymentRequest.year, transaction)
    const latestPayment = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    const payments = getDetailedPayments(calculation, latestPayment, settlement)

    await transaction.commit()
    return {
      ...details,
      address,
      funding,
      payments,
      scheme,
      documentReference: scheduleId
    }
  } catch (err) {
    await transaction.rollback()
    throw new Error(`Settlement with settlementId: ${settlementId} does not have the required data: ${err.message}`)
  }
}

module.exports = getStatement
