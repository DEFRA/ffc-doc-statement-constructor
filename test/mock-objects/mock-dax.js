const { DAX: DAX_TYPE } = require('../../app/constants/types')
const { DATE: UPDATED_TIMESTAMP } = require('../mock-components/mock-dates').UPDATED

module.exports = {
  calculationId: 123759086,
  calculationReference: 123759086,
  paymentPeriod: '1st November 2023 to 31st January 2024',
  paymentReference: 'PY2066436',
  paymentAmount: -3495,
  transactionDate: UPDATED_TIMESTAMP,
  type: DAX_TYPE
}
