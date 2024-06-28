const { STATEMENT, SFI23ADVANCEDSTATEMENT } = require('../../constants/categories')
const db = require('../../data')
const isFirstPayment = require('./is-first-payment')
const getDocumentActiveByPaymentRequestId = require('../get-document-active-by-payment-request')
const getPaymentRequestByPaymentRequestId = require('../get-payment-request-by-payment-request-id')

const saveSchedule = async (settlement, transaction) => {
  if (settlement) {
    const paymentRequest = await getPaymentRequestByPaymentRequestId(settlement.paymentRequestId)
    const Sfi23AdvancedStatementPaymentRequestNumber = 0
    if (!paymentRequest) {
      return
    }
    if (paymentRequest.sourceSystem === 'SFI' && isFirstPayment(settlement.invoiceNumber)) {
      const isActiveDocument = await getDocumentActiveByPaymentRequestId(settlement.paymentRequestId, STATEMENT)
      await db.schedule.create({ settlementId: settlement.settlementId, category: STATEMENT, isActiveDocument }, { transaction })
      return
    }
    if (paymentRequest.sourceSystem === 'Injection' && paymentRequest.paymentRequestNumber === Sfi23AdvancedStatementPaymentRequestNumber) {
      const isActiveDocument = await getDocumentActiveByPaymentRequestId(settlement.paymentRequestId, SFI23ADVANCEDSTATEMENT)
      await db.schedule.create({ settlementId: settlement.settlementId, category: SFI23ADVANCEDSTATEMENT, isActiveDocument }, { transaction })
    }
  } else {
    throw new Error('Schedule can not be saved for null settlement')
  }
}

module.exports = saveSchedule
