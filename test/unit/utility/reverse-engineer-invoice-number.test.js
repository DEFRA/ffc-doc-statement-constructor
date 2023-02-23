const { reverseEngineerInvoiceNumber } = require('../../../app/utility')

const { SFI_FIRST_PAYMENT: INVOICE_NUMBER } = require('../../mock-components/mock-invoice-number')
const { SFI_FIRST_PAYMENT_ORIGINAL: ORIGINAL_INVOICE_NUMBER } = require('../../mock-components/mock-invoice-number')

describe('reverse engineer original invoice number from processed invoice number', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return ORIGINAL_INVOICE_NUMBER when SFI_FIRST_PAYMENT_INVOICE_NUMBER is given', async () => {
    const result = await reverseEngineerInvoiceNumber(INVOICE_NUMBER)
    expect(result).toBe(ORIGINAL_INVOICE_NUMBER)
  })
})
