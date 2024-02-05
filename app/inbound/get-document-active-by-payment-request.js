const getDocumentTypeByCode = require('./get-document-type-by-code')
const getDocumentStatus = require('./get-document-status')

const getDocumentActiveByPaymentRequestId = async (paymentRequestId, documentTypeCode) => {
  const documentType = await getDocumentTypeByCode(documentTypeCode)
  if (documentType) {
    const documentStatus = await getDocumentStatus(documentType.documentTypeId, paymentRequestId)
    return documentStatus ? documentStatus.isActive : false
  }

  return false
}

module.exports = getDocumentActiveByPaymentRequestId
