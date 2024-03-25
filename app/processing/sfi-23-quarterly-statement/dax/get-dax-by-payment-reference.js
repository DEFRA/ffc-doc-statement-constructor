const db = require('../../../data')

const getDaxByPaymentReference = async (paymentReference) => {
  return db.dax.findOne({
    attributes: [
      'paymentReference',
      'calculationId',
      'paymentPeriod',
      'paymentAmount',
      'transactionDate'
    ],
    where: {
      paymentReference
    },
    raw: true
  })
}

module.exports = getDaxByPaymentReference
