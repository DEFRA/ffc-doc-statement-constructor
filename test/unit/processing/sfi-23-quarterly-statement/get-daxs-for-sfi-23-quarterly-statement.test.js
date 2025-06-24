const db = require('../../../../app/data')
const getDaxsForSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/get-daxs-for-sfi-23-quarterly-statement')

jest.mock('../../../../app/config', () => ({
  processingConfig: {
    maxProcessingBatchSize: 5
  }
}))

jest.mock('../../../../app/data', () => ({
  dax: {
    findAll: jest.fn()
  },
  Sequelize: {
    Op: { lt: 'lt' }
  }
}))

describe('getDaxsForSfi23QuarterlyStatement', () => {
  const transaction = { id: 'txn1' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.dax.findAll with correct arguments', async () => {
    db.dax.findAll.mockResolvedValue([])
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    await getDaxsForSfi23QuarterlyStatement(transaction)
    expect(db.dax.findAll).toHaveBeenCalledWith({
      lock: true,
      skipLocked: true,
      order: [['lastProcessAttempt', 'ASC']],
      limit: 5,
      transaction,
      attributes: [
        'daxId',
        'calculationId',
        'paymentReference',
        'paymentPeriod',
        'paymentAmount',
        'transactionDate'
      ],
      where: {
        startPublish: null,
        transactionDate: { [db.Sequelize.Op.lt]: today }
      },
      raw: true
    })
  })

  test('returns the result from db.dax.findAll', async () => {
    const expected = [{ daxId: 1 }]
    db.dax.findAll.mockResolvedValue(expected)
    const result = await getDaxsForSfi23QuarterlyStatement(transaction)
    expect(result).toBe(expected)
  })

  test('logs and throws a new error if db.dax.findAll throws', async () => {
    const error = new Error('DB error')
    db.dax.findAll.mockRejectedValue(error)
    const spy = jest.spyOn(console, 'error').mockImplementation(() => { })
    await expect(getDaxsForSfi23QuarterlyStatement(transaction)).rejects.toThrow('Failed to fetch dax records for SFI23 statements')
    expect(spy).toHaveBeenCalledWith('Error fetching dax records for SFI23 statements:', error)
    spy.mockRestore()
  })
})
