const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['excludedPaymentReferences'])

jest.mock('../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeExcludedPaymentReferences } = require('../../../app/retention/remove-excluded-payment-references')

describe('removeExcludedPaymentReferences', () => {
  const paymentReferences = ['PY1', 'PY2']
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(2)
  })

  test('deletes the rows matching the ids against the transaction', async () => {
    await removeExcludedPaymentReferences(paymentReferences, transaction)

    expect(mockDb.tables.excludedPaymentReferences).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('paymentReference', paymentReferences)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    mockDb.builder.rejects(new Error('DB destroy error'))

    await expect(removeExcludedPaymentReferences(paymentReferences, transaction)).rejects.toThrow('DB destroy error')
  })
})
