const moment = require('moment')

const { SFI_GROSS_VALUE_AP } = require('../../app/constants/account-codes')
const { GBP } = require('../../app/constants/currencies')
const { RP00 } = require('../../app/constants/delivery-bodies')
const { GROSS_VALUE } = require('../../app/constants/descriptions')
const { DRD10 } = require('../../app/constants/fund-codes')
const { ARABLE_SOIL_INTRODUCTORY } = require('../../app/constants/funding-codes')
const { AP, AR } = require('../../app/constants/ledgers')
const { FIRST_PAYMENT: FIRST_PAYMENT_PAYMENT_REQUEST_NUMBER, POST_PAYMENT_ADJUSTMENT: POST_PAYMENT_ADJUSTMENT_PAYMENT_REQUEST_NUMBER } = require('../../app/constants/payment-request-numbers')
const { DAX_CODES } = require('../../app/constants/schedules')
const { SFI: SFI_SCHEME_ID } = require('../../app/constants/scheme-ids')
const { SFI: SFI_SOURCE_SYSTEM } = require('../../app/constants/source-systems').PAYMENT_SERVICE
const { COMPLETED, IN_PROGRESS } = require('../../app/constants/statuses')

const { SFI: SFI_AGREEMENT_NUMBER } = require('../mock-components/mock-agreement-number')
const { SFI: SFI_CONTRACT_NUMBER } = require('../mock-components/mock-contract-number')
const { DATE_FORMAT: DUE_DATE } = require('../mock-components/mock-dates').DUE
const FRN = require('../mock-components/mock-frn')
const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER, SFI_SECOND_PAYMENT: SFI_SECOND_PAYMENT_INVOICE_NUMBER, SFI_SPLIT_A: SFI_SPLIT_A_INVOICE_NUMBER, SFI_SPLIT_B: SFI_SPLIT_B_INVOICE_NUMBER } = require('../mock-components/mock-invoice-number')
const _2022 = require('../mock-components/mock-marketing-year')
const { DATE: RECEIVED_DATE } = require('../mock-components/mock-dates').RECEIVED
const { CORRELATION_ID, REFERENCE_ID, CORRELATION_ID_POST_PAYMENT_ADJUSTMENT, REFERENCE_ID_POST_PAYMENT_ADJUSTMENT } = require('../mock-components/mock-uuidv4')
const { FIVE_HUNDRED_POUNDS, ONE_HUNDRED_POUNDS, ONE_THOUSAND_POUNDS, MINUS_FOUR_HUNDRED_POUNDS, MINUS_TWO_HUNDRED_POUNDS } = require('../mock-components/mock-value')

const paymentRequest = {
  agreementNumber: SFI_AGREEMENT_NUMBER,
  contractNumber: SFI_CONTRACT_NUMBER,
  correlationId: CORRELATION_ID,
  currency: GBP,
  deliveryBody: RP00,
  dueDate: DUE_DATE,
  frn: FRN,
  invoiceLines: [
    {
      accountCode: SFI_GROSS_VALUE_AP,
      description: GROSS_VALUE,
      fundCode: DRD10,
      schemeCode: ARABLE_SOIL_INTRODUCTORY,
      value: FIVE_HUNDRED_POUNDS
    }
  ],
  invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER,
  ledger: AP,
  marketingYear: _2022,
  paymentRequestNumber: FIRST_PAYMENT_PAYMENT_REQUEST_NUMBER,
  received: RECEIVED_DATE,
  referenceId: REFERENCE_ID,
  schedule: DAX_CODES.QUARTERLY,
  schemeId: SFI_SCHEME_ID,
  sourceSystem: SFI_SOURCE_SYSTEM,
  value: FIVE_HUNDRED_POUNDS
}

const processingPaymentRequest = {
  ...paymentRequest,
  status: IN_PROGRESS
}

const submitPaymentRequest = {
  ...processingPaymentRequest,
  completedPaymentRequestId: 1,
  invalid: false,
  invoiceLines: [{
    ...processingPaymentRequest.invoiceLines[0],
    completedInvoiceLineId: 1,
    completedPaymentRequestId: 1
  }],
  received: moment(RECEIVED_DATE).add(1, 'days').toDate(),
  paymentRequestId: 1,
  status: COMPLETED
}

const topUpProcessingPaymentRequest = {
  ...processingPaymentRequest,
  value: ONE_THOUSAND_POUNDS,
  paymentRequestNumber: POST_PAYMENT_ADJUSTMENT_PAYMENT_REQUEST_NUMBER,
  correlationId: CORRELATION_ID_POST_PAYMENT_ADJUSTMENT,
  referenceId: REFERENCE_ID_POST_PAYMENT_ADJUSTMENT,
  invoiceNumber: SFI_SECOND_PAYMENT_INVOICE_NUMBER,
  invoiceLines: [{
    ...processingPaymentRequest.invoiceLines[0],
    value: ONE_THOUSAND_POUNDS
  }]
}

const topUpSubmitPaymentRequest = {
  ...topUpProcessingPaymentRequest,
  value: FIVE_HUNDRED_POUNDS,
  status: COMPLETED,
  invoiceLines: [{
    ...topUpProcessingPaymentRequest.invoiceLines[0],
    value: FIVE_HUNDRED_POUNDS
  }]
}

const downwardAdjustmentProcessingPaymentRequest = {
  ...topUpProcessingPaymentRequest,
  value: ONE_HUNDRED_POUNDS,
  invoiceLines: [{
    ...topUpProcessingPaymentRequest.invoiceLines[0],
    value: ONE_HUNDRED_POUNDS
  }]
}

const downwardAdjustmentSubmitPaymentRequest = {
  ...downwardAdjustmentProcessingPaymentRequest,
  value: MINUS_FOUR_HUNDRED_POUNDS,
  status: COMPLETED,
  invoiceLines: [{
    ...downwardAdjustmentProcessingPaymentRequest.invoiceLines[0],
    value: MINUS_FOUR_HUNDRED_POUNDS
  }]
}

const recoveryProcessingPaymentRequest = {
  ...downwardAdjustmentProcessingPaymentRequest
}

const recoverySubmitPaymentRequest = {
  ...downwardAdjustmentSubmitPaymentRequest,
  ledger: AR
}

const splitProcessingPaymentRequest = {
  ...downwardAdjustmentProcessingPaymentRequest
}

const splitSubmitPaymentRequestA = {
  ...downwardAdjustmentSubmitPaymentRequest,
  value: MINUS_TWO_HUNDRED_POUNDS,
  invoiceNumber: SFI_SPLIT_A_INVOICE_NUMBER,
  invoiceLines: [{
    ...downwardAdjustmentSubmitPaymentRequest.invoiceLines[0],
    value: MINUS_TWO_HUNDRED_POUNDS
  }]
}

const splitSubmitPaymentRequestB = {
  ...downwardAdjustmentSubmitPaymentRequest,
  value: MINUS_TWO_HUNDRED_POUNDS,
  invoiceNumber: SFI_SPLIT_B_INVOICE_NUMBER,
  invoiceLines: [{
    ...downwardAdjustmentSubmitPaymentRequest.invoiceLines[0],
    value: MINUS_TWO_HUNDRED_POUNDS
  }]
}

module.exports = {
  processingPaymentRequest,
  submitPaymentRequest,
  topUpProcessingPaymentRequest,
  topUpSubmitPaymentRequest,
  downwardAdjustmentProcessingPaymentRequest,
  downwardAdjustmentSubmitPaymentRequest,
  recoveryProcessingPaymentRequest,
  recoverySubmitPaymentRequest,
  splitProcessingPaymentRequest,
  splitSubmitPaymentRequestA,
  splitSubmitPaymentRequestB
}
