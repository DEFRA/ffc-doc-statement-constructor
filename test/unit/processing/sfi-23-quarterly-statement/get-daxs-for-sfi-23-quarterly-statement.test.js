const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['dax'])

jest.mock('../../../../app/config', () => ({
  processingConfig: {
    maxProcessingBatchSize: 5
  }
}))
jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getDaxsForSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/get-daxs-for-sfi-23-quarterly-statement')

describe('getDaxsForSfi23QuarterlyStatement', () => {
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('selects unstarted rows before today, oldest attempt first, locked and skipping locked rows', async () => {
    mockDb.builder.resolves([])
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await getDaxsForSfi23QuarterlyStatement(transaction)

    expect(mockDb.tables.dax).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.select).toHaveBeenCalledWith(
      'daxId',
      'calculationId',
      'paymentReference',
      'paymentPeriod',
      'paymentAmount',
      'transactionDate'
    )
    expect(mockDb.builder.whereNull).toHaveBeenCalledWith('startPublish')
    expect(mockDb.builder.where).toHaveBeenCalledWith('transactionDate', '<', today)
    expect(mockDb.builder.orderBy).toHaveBeenCalledWith('lastProcessAttempt', 'asc')
    expect(mockDb.builder.limit).toHaveBeenCalledWith(5)
    expect(mockDb.builder.forUpdate).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.skipLocked).toHaveBeenCalledTimes(1)
  })

  test('returns the selected rows', async () => {
    const expected = [{ daxId: 1 }]
    mockDb.builder.resolves(expected)

    const result = await getDaxsForSfi23QuarterlyStatement(transaction)

    expect(result).toBe(expected)
  })

  test('logs and throws a new error if the query throws', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)
    const spy = jest.spyOn(console, 'error').mockImplementation(() => { })

    await expect(getDaxsForSfi23QuarterlyStatement(transaction)).rejects.toThrow('Failed to fetch dax records for SFI23 statements')

    expect(spy).toHaveBeenCalledWith('Error fetching dax records for SFI23 statements:', error)
    spy.mockRestore()
  })
})
