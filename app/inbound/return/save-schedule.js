const { STATEMENT } = require('../../constants/categories')
const db = require('../../data')
const isFirstPayment = require('./is-first-payment')
const getDocumentActiveByPaymentRequestId = require('../get-document-active-by-payment-request')

const saveSchedule = async (settlement, transaction) => {
  if (settlement) {
    if (isFirstPayment(settlement.invoiceNumber)) {
      const isActiveDocument = await getDocumentActiveByPaymentRequestId(settlement.paymentRequestId, STATEMENT)
      await db.schedule.create({ settlementId: settlement.settlementId, category: STATEMENT, isActiveDocument }, { transaction })
    }
  } else {
    throw new Error('Schedule can not be saved for null settlement')
  }
}

module.exports = saveSchedule
