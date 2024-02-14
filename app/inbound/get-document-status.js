const db = require('../data')
const getPaymentRequestByPaymentRequestId = require('./get-payment-request-by-payment-request-id')

const getDocumentStatus = async (documentTypeId, paymentRequestId) => {
  const paymentRequest = await getPaymentRequestByPaymentRequestId(paymentRequestId)
  if (paymentRequest) {
    return db.documentStatus.findOne({
      where: {
        documentTypeId,
        schemeId: paymentRequest.schemeId,
        marketingYear: paymentRequest.marketingYear,
        isCurrent: true,
        isActive: true
      }
    })
  }
}

module.exports = getDocumentStatus
