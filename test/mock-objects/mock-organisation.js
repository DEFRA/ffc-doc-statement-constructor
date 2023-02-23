const { ORGANISATION: ORGANISATION_TYPE } = require('../../app/constants/types')

const BUSINESS_NAME = require('../mock-components/mock-organisation-name')
const EMAIL_ADDRESS = require('../mock-components/mock-email-address')
const FRN = require('../mock-components/mock-frn')
const {
  LINE_1,
  LINE_2,
  LINE_3,
  CITY,
  COUNTY,
  POSTCODE
} = require('../mock-components/mock-address')
const SBI = require('../mock-components/mock-sbi')
const { DATE: UPDATED_TIMESTAMP } = require('../mock-components/mock-dates').UPDATED

module.exports = {
  addressLine1: LINE_1,
  addressLine2: LINE_2,
  addressLine3: LINE_3,
  city: CITY,
  county: COUNTY,
  emailAddress: EMAIL_ADDRESS,
  frn: FRN,
  name: BUSINESS_NAME,
  sbi: SBI,
  postcode: POSTCODE,
  type: ORGANISATION_TYPE,
  updated: UPDATED_TIMESTAMP
}
