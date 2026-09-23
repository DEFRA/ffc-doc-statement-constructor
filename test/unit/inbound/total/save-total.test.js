const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['totals'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const saveTotal = require('../../../../app/inbound/total/save-total')

describe('saveTotal', () => {
  const transaction = mockDb.trx
  const total = {
    calculationReference: 123456789,
    claimReference: 987654321,
    sbi: 105321000,
    frn: 1234567890,
    agreementNumber: 111,
    schemeType: 'SFIA',
    calculationDate: '2024-01-01',
    invoiceNumber: 'INV1',
    agreementStart: '2023-01-01',
    agreementEnd: '2024-01-01',
    totalAdditionalPayments: 1,
    totalActionPayments: 2,
    totalPayments: 3,
    updated: '2024-01-02',
    type: 'total',
    actions: [{ actionReference: 1 }]
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('inserts the totals columns with references mapped to ids', async () => {
    await saveTotal(total, transaction)

    expect(mockDb.tables.totals).toHaveBeenCalledWith(transaction)
    const [row] = mockDb.builder.insert.mock.calls[0]
    expect(row).toMatchObject({ calculationId: 123456789, claimId: 987654321, sbi: 105321000, schemeType: 'SFIA' })
    expect(row).not.toHaveProperty('calculationReference')
    expect(row).not.toHaveProperty('claimReference')
    expect(row).not.toHaveProperty('type')
    expect(row).not.toHaveProperty('actions')
  })

  test('wraps an insert failure with the calculation id', async () => {
    mockDb.builder.rejects(new Error('boom'))

    await expect(saveTotal(total, transaction)).rejects.toThrow('Error saving total with Calculation Id 123456789: boom')
  })
})
