const db = require('../../../data')

const getDaxByPaymentReference = async (calculationId) => {
  return db.dax.findOne({
    attributes: [
      'paymentReference',
      'calculationId',
      'paymentPeriod',
      'paymentAmount',
      'transactionDate'
    ],
    where: {
      calculationId
    },
    raw: true
  })
}

module.exports = getDaxByPaymentReference
