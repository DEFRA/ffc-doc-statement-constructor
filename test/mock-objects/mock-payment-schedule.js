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
  scheme: {
    frequency: FREQUENCY_QUARTERLY,
    name: SFI_LONG_SCHEME_NAME,
    shortName: SFI_SHORT_SCHEME_NAME,
    year: _2022
  },
  adjustment: {
    adjustmentValue: '500.00',
    currentValue: '1000.00',
    newValue: '1500.00'
  }
}
