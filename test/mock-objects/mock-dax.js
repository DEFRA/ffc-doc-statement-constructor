const { DAX: DAX_TYPE } = require('../../app/constants/types')
const { DATE: UPDATED_TIMESTAMP } = require('../mock-components/mock-dates').UPDATED

module.exports = {
  paymentReference: 'some-reference',
  paymentPeriod: 'some-period',
  paymentAmount: 123.45,
  transactionDate: UPDATED_TIMESTAMP,
  datePublished: UPDATED_TIMESTAMP,
  type: DAX_TYPE
}
