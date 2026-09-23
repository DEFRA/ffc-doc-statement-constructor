const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['dax'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getDaxByCalculationIdAndPaymentReference = require('../../../../app/inbound/dax/get-dax-by-calculation-id-and-payment-reference')

describe('getDaxByCalculationIdAndPaymentReference', () => {
  const dax = { calculationReference: 123, paymentReference: 'PY12345' }
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('looks up a locked row by calculation id and payment reference against the transaction', async () => {
    mockDb.builder.resolves({})

    await getDaxByCalculationIdAndPaymentReference(dax, transaction)

    expect(mockDb.tables.dax).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ calculationId: 123, paymentReference: 'PY12345' })
    expect(mockDb.builder.forUpdate).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
  })

  test('returns the record when found', async () => {
    const expected = { daxId: 1, calculationId: 123, paymentReference: 'PY12345' }
    mockDb.builder.resolves(expected)

    const result = await getDaxByCalculationIdAndPaymentReference(dax, transaction)

    expect(result).toBe(expected)
  })

  test('returns null when no record is found', async () => {
    mockDb.builder.resolves(undefined)

    const result = await getDaxByCalculationIdAndPaymentReference(dax, transaction)

    expect(result).toBeNull()
  })
})
