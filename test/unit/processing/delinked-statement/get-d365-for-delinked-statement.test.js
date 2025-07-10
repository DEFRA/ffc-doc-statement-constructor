const db = require('../../../../app/data')
const getD365ForDelinkedStatement = require('../../../../app/processing/delinked-statement/get-d365-for-delinked-statement')

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

  test('logs and throws a new error if db.d365.findAll throws', async () => {
    const error = new Error('DB error')
    db.d365.findAll.mockRejectedValue(error)
    const spy = jest.spyOn(console, 'error').mockImplementation(() => { })
    global.Op = db.Sequelize.Op
    await expect(getD365ForDelinkedStatement(transaction)).rejects.toThrow('Failed to fetch D365 for delinked statement')
    expect(spy).toHaveBeenCalledWith('Error fetching D365 for delinked statement:', error)
    spy.mockRestore()
  })
})
