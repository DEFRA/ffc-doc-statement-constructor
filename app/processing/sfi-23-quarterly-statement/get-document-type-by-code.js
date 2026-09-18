const { documentTypes } = require('../../data')

const getDocumentTypeByCode = async (code) => {
  const documentType = await documentTypes()
    .select('documentTypeId')
    .where({ code })
    .first()
  return documentType ?? null
}

module.exports = getDocumentTypeByCode
