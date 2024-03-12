// const { TOTAL: TOTAL_TYPE } = require('../../app/constants/types')

const { DATE: UPDATED_TIMESTAMP } = require('../mock-components/mock-dates').UPDATED
const SBI = require('../mock-components/mock-sbi')
const FRN = require('../mock-components/mock-frn')
const AGREEMENTNUMBER = require('../mock-components/mock-agreement-number')
const { NOW: UPDATED } = require('../mock-components/mock-dates').UPDATED

module.exports = {
  sbi: SBI,
  frn: FRN,
  agreementNumber: AGREEMENTNUMBER,
  claimId: 11234567890,
  schemeType: 'FAR1',
  calculationId: 12345678901,
  calculationDate: UPDATED_TIMESTAMP,
  // invoiceNumber: INVOICENUMBER,
  agreementStart: UPDATED,
  // agreementEnd: AGREEMENTEND,
  totalAdditionalPayments: 198.76,
  totalActionPayments: 19876.54,
  totalPayments: 9987.65,
  updated: UPDATED_TIMESTAMP
}
