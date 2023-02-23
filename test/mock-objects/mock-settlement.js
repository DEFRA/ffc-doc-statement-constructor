const { GBP } = require('../../app/constants/currencies')
const { AP } = require('../../app/constants/ledgers')
const { SFI: SFI_SOURCE_SYSTEM } = require('../../app/constants/source-systems').DAX

const FRN = require('../mock-components/mock-frn')
const { FIVE_HUNDRED_POUNDS } = require('../mock-components/mock-value')
const { STRING_FORMAT: SETTLEMENT_DATE } = require('../mock-components/mock-dates').SETTLEMENT
const { SETTLEMENT_REFERENCE } = require('../mock-components/mock-settlement-reference')
const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER } = require('../mock-components/mock-invoice-number')
const { DATE: RECEIVED_DATE } = require('../mock-components/mock-dates').RECEIVED

module.exports = {
  sourceSystem: SFI_SOURCE_SYSTEM,
  invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER,
  frn: FRN,
  currency: GBP,
  ledger: AP,
  value: FIVE_HUNDRED_POUNDS,
  settlementDate: SETTLEMENT_DATE,
  reference: SETTLEMENT_REFERENCE,
  settled: true,
  paymentValue: FIVE_HUNDRED_POUNDS,
  lastSettlementValue: 0,
  received: RECEIVED_DATE
}
