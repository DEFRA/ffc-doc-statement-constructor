const db = require('../../data')

const saveDocument = async (document) => {
  return db.document.create(document)
}

module.exports = saveDocument
