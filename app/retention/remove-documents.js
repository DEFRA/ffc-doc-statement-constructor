const { documents } = require('../data')

const removeDocuments = async (paymentReferences, transaction) => {
  await documents(transaction)
    .whereIn('documentSourceReference', paymentReferences)
    .del()
}

module.exports = {
  removeDocuments
}
