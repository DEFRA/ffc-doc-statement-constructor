const convertToPounds = require('../../app/utility/convert-to-pounds')
const getRemainingAmount = require('../../app/processing/components/get-remaining-amount')

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
const { SFI: AGREEMENT_NUMBER } = require('../mock-components/mock-agreement-number')
const { Q4: FREQUENCY_QUARTERLY } = require('../../app/constants/schedules').NAMES
const { SFI: SFI_LONG_SCHEME_NAME } = require('../../app/constants/scheme-names').LONG_NAMES
const { SFI: SFI_SHORT_SCHEME_NAME } = require('../../app/constants/scheme-names').SHORT_NAMES
const _2022 = require('../mock-components/mock-marketing-year')
const {
  processingPaymentRequest,
  topUpProcessingPaymentRequest
} = require('../mock-objects/mock-payment-request')
const SCHEDULE = require('./mock-schedule-periods')
const PAYMENT_TIMELINE = require('./mock-payment-timelines')

module.exports = {
  businessName: BUSINESS_NAME,
  documentReference: DOCUMENT_REFERENCE,
  email: EMAIL_ADDRESS,
  frn: Number(FRN),
  remainingAmount: getRemainingAmount(PAYMENT_TIMELINE, topUpProcessingPaymentRequest.value),
  sbi: Number(SBI),
  address: {
    line1: LINE_1,
    line2: LINE_2,
    line3: LINE_3,
    line4: CITY,
    line5: COUNTY,
    postcode: POSTCODE
  },
  scheme: {
    agreementNumber: AGREEMENT_NUMBER,
    frequency: FREQUENCY_QUARTERLY,
    name: SFI_LONG_SCHEME_NAME,
    shortName: SFI_SHORT_SCHEME_NAME,
    year: String(_2022)
  },
  adjustment: {
    adjustmentValue: convertToPounds(Number(topUpProcessingPaymentRequest.value) - Number(processingPaymentRequest.value)),
    currentValue: convertToPounds(Number(processingPaymentRequest.value)),
    newValue: convertToPounds(Number(topUpProcessingPaymentRequest.value))
  },
  schedule: SCHEDULE
}
