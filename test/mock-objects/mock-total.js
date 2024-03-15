const { TOTAL: TOTAL_TYPE } = require('../../app/constants/types')

const { DATE: UPDATED_TIMESTAMP } = require('../mock-components/mock-dates').UPDATED
const INVOICENUMBER = require('../mock-components/mock-invoice-number')
const SBI = require('../mock-components/mock-sbi')
const FRN = require('../mock-components/mock-frn')
const AGREEMENTNUMBER = require('../mock-components/mock-agreement-number')
const { NOW: UPDATED } = require('../mock-components/mock-dates').UPDATED

module.exports = {
  sbi: SBI,
  frn: FRN,
  agreementNumber: AGREEMENTNUMBER,
  claimId: 11,
  schemeType: 'SFIA',
  calculationId: 123759085,
  calculationReference: 123759085,
  calculationDate: UPDATED_TIMESTAMP,
  invoiceNumber: INVOICENUMBER,
  claimReference: '123456',
  actions: [],
  agreementStart: UPDATED,
  agreementEnd: UPDATED,
  totalAdditionalPayments: 198.76,
  totalActionPayments: 19876.54,
  totalPayment: 9987.65,
  updated: UPDATED_TIMESTAMP,
  type: TOTAL_TYPE
}
