const db = require('../../data')
const { getDetails, getAddress, getScheme, getDetailedPayments } = require('../components')
const { getLatestInProgressPaymentRequest } = require('../payment-request')
const { getSettlement, getSupportingSettlements } = require('../settlement')
const { getLatestPayment } = require('../payment')
const getPaymentRequestByPaymentRequestId = require('../../inbound/get-payment-request-by-payment-request-id')
const getOrganisationByFrn = require('../organisation/get-organisation-by-frn')
const { SHORT_NAMES } = require('../../constants/scheme-names')
const sfiaGetFunding = require('../components/sfia-hard-coded/sfia-fundings')

const getSfi23AdvancedStatement = async (settlementId, scheduleId) => {
  const transaction = await db.sequelize.transaction()
  try {
    const settlement = await getSettlement(settlementId, transaction)
    const paymentRequest = await getLatestInProgressPaymentRequest(settlement.paymentRequestId, settlement.settlementDate, transaction)
    const sfiaPaymentRequest = await getPaymentRequestByPaymentRequestId(paymentRequest.paymentRequestId)
    const sfiaOrganisation = await getOrganisationByFrn(sfiaPaymentRequest.frn)
    const sfiaCalculation = { calculated: '05/11/2023', sbi: sfiaOrganisation.sbi }
    const sfiaSbi = sfiaCalculation.sbi
    const sfiaDetails = await getDetails(sfiaSbi, transaction)
    const sfiaAddress = await getAddress(sfiaSbi, transaction)
    const sfiaScheme = await getScheme(paymentRequest.year, paymentRequest.frequency, paymentRequest.agreementNumber, SHORT_NAMES.SFIA)
    const supportingSettlements = await getSupportingSettlements(settlement.settlementDate, paymentRequest.agreementNumber, paymentRequest.year, transaction)
    paymentRequest.schedule = 'Q4'
    const latestPaymentSfia = getLatestPayment(paymentRequest, settlement, supportingSettlements)
    const sfiaPayments = getDetailedPayments(sfiaCalculation, latestPaymentSfia, settlement)
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
  } catch (err) {
    await transaction.rollback()
    throw new Error(`Settlement with settlementId: ${settlementId} does not have the required data: ${err.message}`)
  }
}

module.exports = getSfi23AdvancedStatement
