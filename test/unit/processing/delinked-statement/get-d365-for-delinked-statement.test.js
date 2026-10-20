const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['d365'])

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
jest.mock('ffc-alerting-utils', () => ({
  dataProcessingAlert: jest.fn()
}))

const { dataProcessingAlert } = require('ffc-alerting-utils')
const getD365ForDelinkedStatement = require('../../../../app/processing/delinked-statement/get-d365-for-delinked-statement')

describe('getD365ForDelinkedStatement', () => {
  const transaction = mockDb.trx
  transaction.id = 'txn1'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('selects unstarted rows before today, oldest attempt first, locked and skipping locked rows', async () => {
    mockDb.builder.resolves([])
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await getD365ForDelinkedStatement(transaction)

    expect(mockDb.tables.d365).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.select).toHaveBeenCalledWith('d365Id', 'calculationId', 'paymentReference')
    expect(mockDb.builder.whereNull).toHaveBeenCalledWith('startPublish')
    expect(mockDb.builder.where).toHaveBeenCalledWith('transactionDate', '<', today)
    expect(mockDb.builder.orderBy).toHaveBeenCalledWith('lastProcessAttempt', 'asc')
    expect(mockDb.builder.limit).toHaveBeenCalledWith(5)
    expect(mockDb.builder.forUpdate).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.skipLocked).toHaveBeenCalledTimes(1)
  })

  test('returns the selected rows', async () => {
    const expected = [{ d365Id: 1 }]
    mockDb.builder.resolves(expected)

    const result = await getD365ForDelinkedStatement(transaction)

    expect(result).toBe(expected)
  })

  test('logs, alerts and throws a new error if the query throws and alerting succeeds', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)
    dataProcessingAlert.mockResolvedValueOnce()
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await expect(getD365ForDelinkedStatement(transaction)).rejects.toThrow('Error fetching D365 for delinked statement')

    expect(spy).toHaveBeenCalledTimes(1)
    const firstCallArgs = spy.mock.calls[0]
    expect(firstCallArgs[0]).toBe('Error fetching D365 for delinked statement')
    expect(firstCallArgs[1]).toMatchObject({
      queryContext: expect.objectContaining({
        where: expect.objectContaining({ startPublish: null }),
        limit: 5
      }),
      transactionId: transaction.id,
      error
    })
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    expect(dataProcessingAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        process: 'getD365ForDelinkedStatement',
        transactionId: transaction.id,
        queryContext: expect.objectContaining({ limit: 5 }),
        message: expect.stringContaining('Error fetching D365 for delinked statement: DB error')
      }),
      expect.anything()
    )
    spy.mockRestore()
  })

  test('logs fallback and throws when dataProcessingAlert itself throws', async () => {
    const error = new Error('DB error')
    const alertError = new Error('Alert failed')
    mockDb.builder.rejects(error)
    dataProcessingAlert.mockRejectedValueOnce(alertError)
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await expect(getD365ForDelinkedStatement(transaction)).rejects.toThrow('Error fetching D365 for delinked statement')

    expect(spy).toHaveBeenCalledTimes(2)
    const initialArgs = spy.mock.calls[0]
    expect(initialArgs[0]).toBe('Error fetching D365 for delinked statement')
    expect(initialArgs[1]).toMatchObject({
      queryContext: expect.objectContaining({ limit: 5 }),
      transactionId: transaction.id,
      error
    })
    const fallbackArgs = spy.mock.calls[1]
    expect(fallbackArgs[0]).toBe('Error fetching D365 for delinked statement (alert failed)')
    expect(fallbackArgs[1]).toMatchObject({
      originalError: error,
      alertError
    })
    spy.mockRestore()
  })
})
