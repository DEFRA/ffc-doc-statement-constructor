const { TOTAL: TOTAL_TYPE } = require('../../app/constants/types')

const { DATE: UPDATED_TIMESTAMP } = require('../mock-components/mock-dates').UPDATED
const SBI = require('../mock-components/mock-sbi')
const FRN = require('../mock-components/mock-frn')

module.exports = {
  sbi: SBI,
  frn: FRN,
  agreementNumber: 123456789, // change this to a number
  calculationReference: 123456789, // change this to a number
  calculationId: 123456789,
  claimReference: 123456789, // change this to a number
  schemeType: 'SFIA',
  calculationDate: UPDATED_TIMESTAMP,
  invoiceNumber: 'INVOICE123456', // change this to a string
  agreementStart: '2022-01-01', // literal date string
  agreementEnd: '2022-12-31', // literal date string
  totalAdditionalPayments: 1234.56, // add this
  totalActionPayments: 1234.56, // add this
  totalPayment: 9987.65,
  actions: [],
  updated: UPDATED_TIMESTAMP,
  type: TOTAL_TYPE
}
