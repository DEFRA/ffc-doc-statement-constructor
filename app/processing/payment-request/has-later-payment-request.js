const db = require('../../data')

const hasLaterPaymentRequest = async (paymentRequestId, transaction) => {
  const paymentRequest = await db.paymentRequest.findOne({ where: { paymentRequestId }, transaction })
  const laterPaymentRequests = await db.paymentRequest.findAll({
    where: {
      paymentRequestNumber: {
        [db.Sequelize.Op.gt]: paymentRequest.paymentRequestNumber
      },
      agreementNumber: paymentRequest.agreementNumber,
      marketingYear: paymentRequest.marketingYear,
      frn: paymentRequest.frn,
      schemeId: paymentRequest.schemeId
    }
  }, {
    transaction
  })
  return laterPaymentRequests.length > 0
}

module.exports = hasLaterPaymentRequest
