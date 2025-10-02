const db = require('../../../../app/data')
jest.mock('../../../../app/config', () => ({
  processingConfig: {
    maxProcessingBatchSize: 5
  }
}))
jest.mock('../../../../app/data', () => ({
  d365: {
    findAll: jest.fn()
  },
  Sequelize: {
    Op: { lt: 'lt' }
  }
}))
jest.mock('ffc-alerting-utils', () => ({
  dataProcessingAlert: jest.fn()
}))
const { dataProcessingAlert } = require('ffc-alerting-utils')
const getD365ForDelinkedStatement = require('../../../../app/processing/delinked-statement/get-d365-for-delinked-statement')

describe('getD365ForDelinkedStatement', () => {
  const transaction = { id: 'txn1' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.d365.findAll with correct arguments', async () => {
    db.d365.findAll.mockResolvedValue([])
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    await getD365ForDelinkedStatement(transaction)
    expect(db.d365.findAll).toHaveBeenCalledWith({
      lock: true,
      skipLocked: true,
      order: [['lastProcessAttempt', 'ASC']],
      limit: 5,
      transaction,
      attributes: ['d365Id', 'calculationId', 'paymentReference'],
      where: {
        startPublish: null,
        transactionDate: { [db.Sequelize.Op.lt]: today }
      },
      raw: true
    })
  })

  test('returns the result from db.d365.findAll', async () => {
    const expected = [{ d365Id: 1 }]
    db.d365.findAll.mockResolvedValue(expected)
    const result = await getD365ForDelinkedStatement(transaction)
    expect(result).toBe(expected)
  })

  test('logs, alerts and throws a new error if db.d365.findAll throws and alerting succeeds', async () => {
    const error = new Error('DB error')
    db.d365.findAll.mockRejectedValue(error)
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
    db.d365.findAll.mockRejectedValue(error)
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
