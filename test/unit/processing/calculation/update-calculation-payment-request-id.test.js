const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['calculations'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))
jest.mock('../../../../app/processing/calculation/get-calculation-by-invoice-number')

const getCalculationByInvoiceNumber = require('../../../../app/processing/calculation/get-calculation-by-invoice-number')
const updateCalculationPaymentRequestId = require('../../../../app/processing/calculation/update-calculation-payment-request-id')

describe('updateCalculationPaymentRequestId', () => {
  const transaction = mockDb.trx
  const invoiceNumber = 'S1234567A123456V01'
  const reversedInvoiceNumber = 'SFI01234567'
  const paymentRequestId = 42

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(1)
  })

  test('updates the paymentRequestId on the reversed invoice number and returns the calculation', async () => {
    getCalculationByInvoiceNumber.mockResolvedValue({ calculationId: 1, invoiceNumber: reversedInvoiceNumber, paymentRequestId: null })

    const result = await updateCalculationPaymentRequestId(invoiceNumber, paymentRequestId, transaction)

    expect(getCalculationByInvoiceNumber).toHaveBeenCalledWith(reversedInvoiceNumber, transaction)
    expect(mockDb.tables.calculations).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ invoiceNumber: reversedInvoiceNumber })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ paymentRequestId })
    expect(result).toEqual({ calculationId: 1, invoiceNumber: reversedInvoiceNumber, paymentRequestId })
  })

  test('does not update and returns null when no calculation matches', async () => {
    getCalculationByInvoiceNumber.mockResolvedValue(null)

    const result = await updateCalculationPaymentRequestId(invoiceNumber, paymentRequestId, transaction)

    expect(mockDb.tables.calculations).not.toHaveBeenCalled()
    expect(mockDb.builder.update).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })

  test('propagates an update failure', async () => {
    getCalculationByInvoiceNumber.mockResolvedValue({ calculationId: 1 })
    mockDb.builder.rejects(new Error('DB error'))

    await expect(updateCalculationPaymentRequestId(invoiceNumber, paymentRequestId, transaction)).rejects.toThrow('DB error')
  })
})
