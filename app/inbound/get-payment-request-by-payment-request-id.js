const db = require('../data')

const getPaymentRequestByPaymentRequestId = async (paymentRequestId) => {
  return db.paymentRequest.findOne({
    where: {
      paymentRequestId
    }
  })
}

module.exports = getPaymentRequestByPaymentRequestId
