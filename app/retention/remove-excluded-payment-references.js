const db = require('../data')

const removeExcludedPaymentReferences = async (paymentReferences, transaction) => {
  await db.excludedPaymentReference.destroy({
    where: {
      paymentReference: {
        [db.Sequelize.Op.in]: paymentReferences
      }
    },
    transaction
  })
}

module.exports = {
  removeExcludedPaymentReferences
}
