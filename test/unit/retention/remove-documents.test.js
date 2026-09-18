const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['documents'])

jest.mock('../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeDocuments } = require('../../../app/retention/remove-documents')

describe('removeDocuments', () => {
  const paymentReferences = ['PY1', 'PY2']
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(2)
  })

  test('deletes the rows matching the ids against the transaction', async () => {
    await removeDocuments(paymentReferences, transaction)

    expect(mockDb.tables.documents).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('documentSourceReference', paymentReferences)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    mockDb.builder.rejects(new Error('DB destroy error'))

    await expect(removeDocuments(paymentReferences, transaction)).rejects.toThrow('DB destroy error')
  })
})
