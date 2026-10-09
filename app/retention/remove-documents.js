const { documents } = require('../database')

const removeDocuments = async (paymentReferences, transaction) => {
  await documents(transaction)
    .whereIn('documentSourceReference', paymentReferences)
    .del()
}

module.exports = {
  removeDocuments
}
