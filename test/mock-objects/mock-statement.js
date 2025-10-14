const convertToPounds = require('../../app/utility/convert-to-pounds')

const BUSINESS_NAME = require('../mock-components/mock-organisation-name')
const DOCUMENT_REFERENCE = require('../mock-components/mock-document-reference')
const EMAIL_ADDRESS = require('../mock-components/mock-email-address')
const FRN = require('../mock-components/mock-frn')
const SBI = require('../mock-components/mock-sbi')
const {
  LINE_1,
  LINE_2,
  LINE_3,
  CITY,
  COUNTY,
  POSTCODE
} = require('../mock-components/mock-address')
const { FIVE_HUNDRED_POUNDS } = require('../mock-components/mock-value')
const { DAY_FORMAT: CALCULATED_DATE } = require('../mock-components/mock-dates').CALCULATED
const { DAY_FORMAT: DUE_DATE } = require('../mock-components/mock-dates').DUE
const { SFI_FIRST_PAYMENT: INVOICE_NUMBER } = require('../mock-components/mock-invoice-number')
const PERIOD = require('../mock-components/mock-period')
const { SETTLEMENT_REFERENCE } = require('../mock-components/mock-settlement-reference')
const { DAY_FORMAT: SETTLED_DATE } = require('../mock-components/mock-dates').SETTLEMENT
const { SFI: AGREEMENT_NUMBER } = require('../mock-components/mock-agreement-number')
const _2022 = require('../mock-components/mock-marketing-year')

module.exports = {
  businessName: BUSINESS_NAME,
  documentReference: DOCUMENT_REFERENCE,
  email: EMAIL_ADDRESS,
  frn: Number(FRN),
  sbi: Number(SBI),
  address: {
    line1: LINE_1,
    line2: LINE_2,
    line3: LINE_3,
    line4: CITY,
    line5: COUNTY,
    postcode: POSTCODE
  },
  payments: [
    {
      calculated: CALCULATED_DATE,
      dueDate: DUE_DATE,
      invoiceNumber: INVOICE_NUMBER,
      period: PERIOD,
      reference: SETTLEMENT_REFERENCE,
      settled: SETTLED_DATE,
      value: convertToPounds(FIVE_HUNDRED_POUNDS)
    }
  ],
  scheme: {
    agreementNumber: AGREEMENT_NUMBER,
    frequency: 'quarterly',
    name: 'Sustainable Farming Incentive',
    shortName: 'SFI23',
    year: String(_2022)
  }
}
