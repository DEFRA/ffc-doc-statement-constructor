const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['d365'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const saveD365 = require('../../../../app/inbound/d365/save-d365')

describe('saveD365', () => {
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test.each([
    [{ transactionDate: '2024-01-01', paymentReference: 'ABC123' }, 'paymentAmount'],
    [{ paymentAmount: 100, paymentReference: 'DEF456' }, 'transactionDate']
  ])(
    'throws before touching the database when %s is missing',
    async (badInput) => {
      await expect(saveD365(badInput, transaction)).rejects.toThrow('D365 record missing required fields')
      expect(mockDb.builder.insert).not.toHaveBeenCalled()
    }
  )

  test('inserts the d365 columns against the transaction', async () => {
    const input = {
      paymentReference: 'GHI789',
      calculationId: 123,
      paymentPeriod: '2024-Q1',
      marketingYear: 2024,
      paymentAmount: 100,
      transactionDate: '2024-01-01',
      type: 'd365'
    }

    await saveD365(input, transaction)

    expect(mockDb.tables.d365).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.insert).toHaveBeenCalledWith({
      paymentReference: 'GHI789',
      calculationId: 123,
      paymentPeriod: '2024-Q1',
      marketingYear: 2024,
      paymentAmount: 100,
      transactionDate: '2024-01-01'
    })
  })

  test('propagates an insert failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(saveD365({ paymentAmount: 1, transactionDate: '2024-01-01' }, transaction)).rejects.toThrow('DB error')
  })
})
