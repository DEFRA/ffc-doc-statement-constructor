const { createKnexMock } = require('../../../../helpers/mock-knex')

const mockDb = createKnexMock(['delinkedCalculations'])

jest.mock('../../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getDelinkedByCalculationId = require('../../../../../app/processing/delinked-statement/delinkedCalculation/get-delinked-by-calculation-id')

describe('getDelinkedByCalculationId', () => {
  const row = { calculationId: 12345 }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns the row when one exists', async () => {
    mockDb.builder.resolves(row)

    const result = await getDelinkedByCalculationId(12345)

    expect(mockDb.tables.delinkedCalculations).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.select).toHaveBeenCalledWith(
      'calculationId', 'applicationId', 'sbi', 'frn',
      'paymentBand1', 'paymentBand2', 'paymentBand3', 'paymentBand4',
      'percentageReduction1', 'percentageReduction2', 'percentageReduction3', 'percentageReduction4',
      'progressiveReductions1', 'progressiveReductions2', 'progressiveReductions3', 'progressiveReductions4',
      'referenceAmount', 'totalProgressiveReduction', 'totalDelinkedPayment', 'paymentAmountCalculated'
    )
    expect(mockDb.builder.where).toHaveBeenCalledWith({ calculationId: 12345 })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(result).toEqual(row)
  })

  test('returns null when no row exists', async () => {
    mockDb.builder.resolves(undefined)

    const result = await getDelinkedByCalculationId(12345)

    expect(result).toBeNull()
  })

  test('propagates a query failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(getDelinkedByCalculationId(12345)).rejects.toThrow('DB error')
  })
})
