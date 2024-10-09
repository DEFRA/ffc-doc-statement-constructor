const db = require('../../data')

const getDocumentTypeByCode = async (code) => {
  const result = await db.documentType.findOne({
    attributes: [
      'documentTypeId'
    ],
    where: {
      code
    },
    raw: true
  })

  if (!result) {
    throw new Error(`Document type with code ${code} not found`)
  }

  return result
}

module.exports = getDocumentTypeByCode
