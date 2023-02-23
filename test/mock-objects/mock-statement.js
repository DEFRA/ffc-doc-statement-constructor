const { Q4: FREQUENCY_QUARTERLY } = require('../../app/constants/schedules').NAMES
const { SFI: SFI_SHORT_SCHEME_NAME } = require('../../app/constants/scheme-names').SHORT_NAMES
const { SFI: SFI_LONG_SCHEME_NAME } = require('../../app/constants/scheme-names').LONG_NAMES

const BUSINESS_NAME = require('../mock-components/mock-organisation-name')
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
const { DAY_FORMAT: CALCULATED_DATE } = require('../mock-components/mock-dates').CALCULATED
const { DAY_FORMAT: DUE_DATE } = require('../mock-components/mock-dates').DUE
const { SFI_FIRST_PAYMENT: INVOICE_NUMBER } = require('../mock-components/mock-invoice-number')
const CALCULATION_REFERENCE = require('../mock-components/mock-calculation-reference')
const { DAY_FORMAT: SETTLED_DATE } = require('../mock-components/mock-dates').SETTLEMENT
const _2022 = require('../mock-components/mock-marketing-year')

module.exports = {
  businessName: BUSINESS_NAME,
  email: EMAIL_ADDRESS,
  frn: FRN.toString(),
  sbi: SBI.toString(),
  address: {
    line1: LINE_1,
    line2: LINE_2,
    line3: LINE_3,
    line4: CITY,
    line5: COUNTY,
    postcode: POSTCODE
  },
  funding: [
    {
      annualValue: '110.00',
      area: '5.00',
      level: 'Introductory',
      name: 'Arable and horticultural soils',
      quarterlyPayment: '27.50',
      quarterlyReduction: '0.00',
      quarterlyValue: '27.50',
      rate: '22.00',
      reductions: [

      ]
    },
    {
      annualValue: '388.60',
      area: '12.00',
      level: 'Introductory',
      name: 'Moorland',
      quarterlyPayment: '97.15',
      quarterlyReduction: '0.00',
      quarterlyValue: '97.15',
      rate: '32.38',
      reductions: [

      ]
    },
    {
      annualValue: '400.00',
      area: '10.00',
      level: 'Intermediate',
      name: 'Arable and horticultural soils',
      quarterlyPayment: '25.00',
      quarterlyReduction: '75.00',
      quarterlyValue: '100.00',
      rate: '40.00',
      reductions: [
        {
          reason: 'Late claim submission',
          value: '25.00'
        },
        {
          reason: 'Over declaration reduction',
          value: '50.00'
        }
      ]
    },
    {
      annualValue: '420.00',
      area: '15.00',
      level: 'Introductory',
      name: 'Improved grassland soils',
      quarterlyPayment: '92.50',
      quarterlyReduction: '50.00',
      quarterlyValue: '105.00',
      rate: '28.00',
      reductions: [
        {
          reason: 'Over declaration reduction',
          value: '50.00'
        }
      ]
    },
    {
      annualValue: '1318.60',
      area: '42.00',
      level: '',
      name: 'Total',
      quarterlyPayment: '342.15',
      quarterlyReduction: '125.00',
      quarterlyValue: '329.65',
      rate: ''
    }
  ],
  payments: [
    {
      calculated: CALCULATED_DATE,
      dueDate: DUE_DATE,
      invoiceNumber: INVOICE_NUMBER,
      reference: CALCULATION_REFERENCE,
      settled: SETTLED_DATE,
      value: '242.15'
    }
  ],
  scheme: {
    frequency: FREQUENCY_QUARTERLY,
    name: SFI_LONG_SCHEME_NAME,
    shortName: SFI_SHORT_SCHEME_NAME,
    year: _2022
  }
}
