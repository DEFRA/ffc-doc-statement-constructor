const { TOTAL: TOTAL_TYPE } = require('../../app/constants/types')

const { DATE: UPDATED_TIMESTAMP } = require('../mock-components/mock-dates').UPDATED
const INVOICENUMBER = require('../mock-components/mock-invoice-number')
const AGREEMENTNUMBER = require('../mock-components/mock-agreement-number')
const { NOW: UPDATED } = require('../mock-components/mock-dates').UPDATED

module.exports = {
  sbi: 'wrongSBI',
  frn: 'WRONGFRN',
  agreementNumber: AGREEMENTNUMBER,
  claimId: 11234567890,
  schemeType: 'SFIA',
  calculationId: 'wrong',
  calculationDate: UPDATED_TIMESTAMP,
  invoiceNumber: INVOICENUMBER,
  agreementStart: UPDATED,
  agreementEnd: UPDATED,
  totalAdditionalPayments: 198.76,
  totalActionPayments: 19876.54,
  totalPayments: 9987.65,
  updated: UPDATED_TIMESTAMP,
  type: TOTAL_TYPE
}
