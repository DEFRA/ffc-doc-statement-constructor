const db = require('../../../../app/data')
const getD365ForDelinkedStatement = require('../../../../app/processing/delinked-statement/get-d365-for-delinked-statement')
const updateD365ForStartPublish = require('../../../../app/processing/delinked-statement/update-d365-for-start-publish')
const getVerifiedD365DelinkedStatements = require('../../../../app/processing/delinked-statement/get-verified-d365-delinked-statements')

jest.mock('../../../../app/data')
jest.mock('../../../../app/processing/delinked-statement/get-d365-for-delinked-statement')
jest.mock('../../../../app/processing/delinked-statement/update-d365-for-start-publish')

describe('getVerifiedD365DelinkedStatements', () => {
  let transaction

  beforeEach(() => {
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn()
    }
    db.sequelize.transaction.mockResolvedValue(transaction)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return d365 data on successful execution', async () => {
    const d365Mock = [{ id: 1, name: 'D365 Data' }]
    getD365ForDelinkedStatement.mockResolvedValue(d365Mock)
    updateD365ForStartPublish.mockResolvedValue()

    const result = await getVerifiedD365DelinkedStatements()

    expect(db.sequelize.transaction).toHaveBeenCalled()
    expect(getD365ForDelinkedStatement).toHaveBeenCalledWith(transaction)
    expect(updateD365ForStartPublish).toHaveBeenCalledWith(d365Mock, transaction)
    expect(transaction.commit).toHaveBeenCalled()
    expect(result).toEqual(d365Mock)
  })

  test('should rollback transaction and return empty array if getD365ForDelinkedStatement fails', async () => {
    getD365ForDelinkedStatement.mockRejectedValue(new Error('Failed to get D365 data'))

    const result = await getVerifiedD365DelinkedStatements()

    expect(db.sequelize.transaction).toHaveBeenCalled()
    expect(getD365ForDelinkedStatement).toHaveBeenCalledWith(transaction)
    expect(updateD365ForStartPublish).not.toHaveBeenCalled()
    expect(transaction.rollback).toHaveBeenCalled()
    expect(result).toEqual([])
  })

  test('should rollback transaction and return empty array if updateD365ForStartPublish fails', async () => {
    const d365Mock = [{ id: 1, name: 'D365 Data' }]
    getD365ForDelinkedStatement.mockResolvedValue(d365Mock)
    updateD365ForStartPublish.mockRejectedValue(new Error('Failed to update D365 data'))

    const result = await getVerifiedD365DelinkedStatements()

    expect(db.sequelize.transaction).toHaveBeenCalled()
    expect(getD365ForDelinkedStatement).toHaveBeenCalledWith(transaction)
    expect(updateD365ForStartPublish).toHaveBeenCalledWith(d365Mock, transaction)
    expect(transaction.rollback).toHaveBeenCalled()
    expect(result).toEqual([])
  })
})
