const { FIVE_HUNDRED_POUNDS } = require('../mock-components/mock-value')
const { SETTLEMENT, DUE } = require('../mock-components/mock-dates')
const { SETTLEMENT_REFERENCE } = require('../mock-components/mock-settlement-reference')
const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER } = require('../mock-components/mock-invoice-number')
const PERIOD = require('../mock-components/mock-period')

module.exports = {
  invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER,
  reference: SETTLEMENT_REFERENCE,
  dueDate: DUE.DATE_FORMAT,
  settled: SETTLEMENT.STRING_FORMAT,
  value: FIVE_HUNDRED_POUNDS,
  period: PERIOD
}
