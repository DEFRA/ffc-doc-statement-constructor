const db = require('../../data')

const getDaxByPaymentReference = async (paymentReference, transaction) => {
  return db.dax.findOne({
    transaction,
    lock: true,
    where: {
      paymentReference
    }
  })
}

module.exports = getDaxByPaymentReference
