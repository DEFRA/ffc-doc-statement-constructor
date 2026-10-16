const { documents } = require('../../database')

const saveDocument = async (document) => {
  const [saved] = await documents()
    .insert(document)
    .returning('documentId')
  return saved
}

module.exports = saveDocument
