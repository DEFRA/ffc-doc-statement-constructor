const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['calculations'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getCalculationByInvoiceNumber = require('../../../../app/processing/calculation/get-calculation-by-invoice-number')

describe('getCalculationByInvoiceNumber', () => {
  const transaction = mockDb.trx
  const row = { invoiceNumber: 'SFI01234567' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns the row when one exists', async () => {
    mockDb.builder.resolves(row)

    const result = await getCalculationByInvoiceNumber('SFI01234567', transaction)

    expect(mockDb.tables.calculations).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.select).toHaveBeenCalledWith('calculationId', 'calculationDate', 'invoiceNumber', 'paymentRequestId', 'sbi')
    expect(mockDb.builder.where).toHaveBeenCalledWith({ invoiceNumber: 'SFI01234567' })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(result).toEqual(row)
  })

  test('returns null when no row exists', async () => {
    mockDb.builder.resolves(undefined)

    const result = await getCalculationByInvoiceNumber('SFI01234567', transaction)

    expect(result).toBeNull()
  })

  test('propagates a query failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(getCalculationByInvoiceNumber('SFI01234567', transaction)).rejects.toThrow('DB error')
  })
})
