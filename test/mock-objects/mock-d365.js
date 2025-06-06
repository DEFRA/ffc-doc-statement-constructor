const { D365: D365_TYPE } = require('../../app/constants/types')
const { DATE: UPDATED_TIMESTAMP } = require('../mock-components/mock-dates').UPDATED

module.exports = {
  paymentReference: 'PY2066436',
  calculationReference: 123759086,
  paymentPeriod: '1st November 2023 to 31st January 2024',
  paymentAmount: 999.99,
  marketingYear: 2024,
  transactionDate: UPDATED_TIMESTAMP,
  datePublished: UPDATED_TIMESTAMP,
  type: D365_TYPE
}
