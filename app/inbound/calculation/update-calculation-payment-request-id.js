const db = require('../../data')

const updateCalculationPaymentRequestId = async (paymentRequestId, calculationId, transaction) => {
  await db.calculation.update({ paymentRequestId }, {
    transaction,
    lock: true,
    where: {
      calculationId
    }
  })
}

module.exports = updateCalculationPaymentRequestId
