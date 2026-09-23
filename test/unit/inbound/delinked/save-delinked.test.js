const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['delinkedCalculations'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const saveDelinked = require('../../../../app/inbound/delinked/save-delinked')

const expectedPayload = {
  calculationId: 'calculationReference1',
  applicationId: 'applicationReference1',
  sbi: undefined,
  frn: undefined,
  paymentBand1: undefined,
  paymentBand2: undefined,
  paymentBand3: undefined,
  paymentBand4: undefined,
  percentageReduction1: undefined,
  percentageReduction2: undefined,
  percentageReduction3: undefined,
  percentageReduction4: undefined,
  paymentAmountCalculated: undefined,
  progressiveReductions1: undefined,
  progressiveReductions2: undefined,
  progressiveReductions3: undefined,
  progressiveReductions4: undefined,
  referenceAmount: undefined,
  totalProgressiveReduction: undefined,
  totalDelinkedPayment: undefined,
  datePublished: undefined,
  updated: expect.any(Date)
}

describe('saveDelinked', () => {
  const transaction = mockDb.trx
  const delinkedCalculation = {
    calculationId: 'calculationReference1',
    applicationId: 'applicationReference1'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('inserts the transformed delinked calculation against the transaction', async () => {
    await saveDelinked(delinkedCalculation, transaction)

    expect(mockDb.tables.delinkedCalculations).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.insert).toHaveBeenCalledWith(expectedPayload)
  })

  test('propagates an insert failure', async () => {
    mockDb.builder.rejects(new Error('Database error'))

    await expect(saveDelinked(delinkedCalculation, transaction)).rejects.toThrow('Database error')
  })

  test('does not carry calculationReference or applicationReference into the row', async () => {
    await saveDelinked({ ...delinkedCalculation, calculationReference: 1, applicationReference: 2 }, transaction)

    const [row] = mockDb.builder.insert.mock.calls[0]
    expect(row).not.toHaveProperty('calculationReference')
    expect(row).not.toHaveProperty('applicationReference')
  })
})
