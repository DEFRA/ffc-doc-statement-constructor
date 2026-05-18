const db = require('../data')

const removeDocuments = async (paymentReferences, transaction) => {
  await db.document.destroy({
    where: {
      documentSourceReference: {
        [db.Sequelize.Op.in]: paymentReferences
      }
    },
    transaction
  })
}

module.exports = {
  removeDocuments
}
