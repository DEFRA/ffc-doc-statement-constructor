const { createKnexMock } = require('../../../../helpers/mock-knex')

const mockDb = createKnexMock(['d365'])

jest.mock('../../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getD365ByPaymentReference = require('../../../../../app/processing/delinked-statement/d365/get-d365-by-payment-reference')

describe('getD365ByPaymentReference', () => {
  const row = { paymentReference: 'PY1234567' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns the row when one exists', async () => {
    mockDb.builder.resolves(row)

    const result = await getD365ByPaymentReference('PY1234567')

    expect(mockDb.tables.d365).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.select).toHaveBeenCalledWith('paymentReference', 'calculationId', 'paymentPeriod', 'marketingYear', 'paymentAmount', 'transactionDate')
    expect(mockDb.builder.where).toHaveBeenCalledWith({ paymentReference: 'PY1234567' })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    expect(result).toEqual(row)
  })

  test('returns null when no row exists', async () => {
    mockDb.builder.resolves(undefined)

    const result = await getD365ByPaymentReference('PY1234567')

    expect(result).toBeNull()
  })

  test('propagates a query failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(getD365ByPaymentReference('PY1234567')).rejects.toThrow('DB error')
  })
})
