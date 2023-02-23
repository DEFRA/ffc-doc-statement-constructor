const db = require('../../data')
const { COMPLETED } = require('../../constants/statuses')

const getCompletedPaymentRequestByReferenceId = async (referenceId, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    lock: true,
    where: {
      referenceId,
      status: COMPLETED
    }
  })
}

module.exports = getCompletedPaymentRequestByReferenceId
