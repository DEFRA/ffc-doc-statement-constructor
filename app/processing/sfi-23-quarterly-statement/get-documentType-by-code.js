const db = require('../../data')

const getDocumentTypeByCode = async (code) => {
  return db.documentType.findOne({
    attributes: [
      'documentTypeId'
    ],
    where: {
      code
    },
    raw: true
  })
}

module.exports = getDocumentTypeByCode
