const db = require('../../data')

const updateDelinkedPaymentRequestId = async (paymentRequestId, calculationId, transaction) => {
  await db.delinkedCalculation.update({ paymentRequestId }, {
    transaction,
    lock: true,
    where: {
      calculationId
    }
  })
}

module.exports = updateDelinkedPaymentRequestId
