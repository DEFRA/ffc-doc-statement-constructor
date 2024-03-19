const { TOTAL: TOTAL_TYPE } = require('../../app/constants/types')

const { DATE: UPDATED_TIMESTAMP } = require('../mock-components/mock-dates').UPDATED
const SBI = require('../mock-components/mock-sbi')
const FRN = require('../mock-components/mock-frn')
const ACTION = require('../mock-objects/mock-actions')

module.exports = {
  sbi: SBI,
  frn: FRN,
  agreementNumber: 123456789,
  calculationReference: 123456789,
  claimReference: 123456789,
  schemeType: 'SFIA',
  calculationDate: UPDATED_TIMESTAMP,
  invoiceNumber: 'INVOICE123456',
  agreementStart: new Date('2022-12-31'),
  agreementEnd: new Date('2022-01-01'),
  totalAdditionalPayments: 1234.56,
  totalActionPayments: 1234.56,
  totalPayments: 9987.65,
  actions: [ACTION],
  updated: UPDATED_TIMESTAMP,
  type: TOTAL_TYPE
}
