const getDocumentActiveByPaymentRequestId = require('../get-document-active-by-payment-request')
const { SCHEDULE } = require('../../constants/categories')
const db = require('../../data')

const saveSchedule = async (paymentRequestId, transaction) => {
  const isActiveDocument = await getDocumentActiveByPaymentRequestId(paymentRequestId, SCHEDULE)
  await db.schedule.create({ paymentRequestId, category: SCHEDULE, isActiveDocument }, { transaction })
}

module.exports = saveSchedule
