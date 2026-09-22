const { documentTypes } = require('../../database')

const getDocumentTypeByCode = async (code) => {
  const result = await documentTypes()
    .select('documentTypeId')
    .where({ code })
    .first()

  if (!result) {
    throw new Error(`Document type with code ${code} not found`)
  }

  return result
}

module.exports = getDocumentTypeByCode
