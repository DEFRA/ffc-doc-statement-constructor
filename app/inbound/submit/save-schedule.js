const getDocumentActiveByPaymentRequestId = require('../get-document-active-by-payment-request')
const { STATEMENT } = require('../../constants/categories')
const { SCHEDULE } = require('../../constants/categories')
const db = require('../../data')

const saveSchedule = async (paymentRequestId, transaction) => {
  const isActiveDocument = await getDocumentActiveByPaymentRequestId(paymentRequestId, STATEMENT)
  await db.schedule.create({ paymentRequestId, category: SCHEDULE, isActiveDocument }, { transaction })
}

module.exports = saveSchedule
