const db = require('../data')

const getDocumentTypeByCode = async (documentTypeCode) => {
  return db.documentType.findOne({
    where: {
      code: documentTypeCode.toUpperCase()
    }
  })
}

module.exports = getDocumentTypeByCode
