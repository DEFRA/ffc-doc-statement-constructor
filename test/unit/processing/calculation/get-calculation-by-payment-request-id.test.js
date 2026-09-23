const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['calculations'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getCalculationByPaymentRequestId = require('../../../../app/processing/calculation/get-calculation-by-payment-request-id')

describe('getCalculationByPaymentRequestId', () => {
  const transaction = mockDb.trx
  const row = { paymentRequestId: 42 }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns the row when one exists', async () => {
    mockDb.builder.resolves(row)

    const result = await getCalculationByPaymentRequestId(42, transaction)

    expect(mockDb.tables.calculations).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.select).toHaveBeenCalledWith('calculationId', 'calculationDate', 'invoiceNumber', 'paymentRequestId', 'sbi')
    expect(mockDb.builder.where).toHaveBeenCalledWith({ paymentRequestId: 42 })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(result).toEqual(row)
  })

  test('returns null when no row exists', async () => {
    mockDb.builder.resolves(undefined)

    const result = await getCalculationByPaymentRequestId(42, transaction)

    expect(result).toBeNull()
  })

  test('propagates a query failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(getCalculationByPaymentRequestId(42, transaction)).rejects.toThrow('DB error')
  })
})
