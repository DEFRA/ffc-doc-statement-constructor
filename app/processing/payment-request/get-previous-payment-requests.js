const { IN_PROGRESS } = require('../../constants/statuses')
const db = require('../../data')

const getPreviousPaymentRequests = async (agreementNumber, marketingYear, paymentRequestNumber, transaction) => {
  return db.paymentRequest.findAll({
    where: {
      paymentRequestNumber: {
        [db.Sequelize.Op.lt]: paymentRequestNumber
      },
      agreementNumber,
      marketingYear,
      status: IN_PROGRESS
    },
    order: [['paymentRequestNumber', 'DESC']]
  }, { transaction })
}

module.exports = getPreviousPaymentRequests
