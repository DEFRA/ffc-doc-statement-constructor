const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['dax'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getPreviousPaymentCountByCalculationId = require('../../../../app/processing/sfi-23-quarterly-statement/get-previous-payment-count-by-document-id')

describe('getPreviousPaymentCountByCalculationId', () => {
  const calculationId = 12345

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('counts completed publishes for the calculation and returns a number', async () => {
    mockDb.builder.resolves({ count: '3' })

    const result = await getPreviousPaymentCountByCalculationId(calculationId)

    expect(mockDb.tables.dax).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.count).toHaveBeenCalledWith({ count: '*' })
    expect(mockDb.builder.whereNotNull).toHaveBeenCalledWith('completePublish')
    expect(mockDb.builder.where).toHaveBeenCalledWith({ calculationId })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(result).toBe(3)
  })

  test('returns 0 when nothing has completed publishing', async () => {
    mockDb.builder.resolves({ count: '0' })

    await expect(getPreviousPaymentCountByCalculationId(calculationId)).resolves.toBe(0)
  })

  test('propagates a query failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(getPreviousPaymentCountByCalculationId(calculationId)).rejects.toThrow('DB error')
  })
})
