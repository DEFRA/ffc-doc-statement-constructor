const db = require('../../data')

const getD365ByPaymentReference = async (paymentReference, transaction) => {
  return db.d365.findOne({
    transaction,
    lock: true,
    where: {
      paymentReference
    }
  })
}

module.exports = getD365ByPaymentReference
