const db = require('../../../data')

const getD365ByPaymentReference = async (paymentReference) => {
  return db.d365.findOne({
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

module.exports = getD365ByPaymentReference
