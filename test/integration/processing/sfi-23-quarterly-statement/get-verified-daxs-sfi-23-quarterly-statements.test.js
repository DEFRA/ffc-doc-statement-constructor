
jest.mock('../../../../app/data')
const db = require('../../../../app/data')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/get-daxs-for-sfi-23-quarterly-statement')
const getDaxsForSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/get-daxs-for-sfi-23-quarterly-statement')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/update-daxs-for-start-publish')
const updateDaxsForStartPublish = require('../../../../app/processing/sfi-23-quarterly-statement/update-daxs-for-start-publish')

const getVerifiedDaxsSfi23QuarterlyStatements = require('../../../../app/processing/sfi-23-quarterly-statement/get-verified-daxs-sfi-23-quarterly-statements')

describe('getVerifiedDaxsSfi23QuarterlyStatements', () => {
  let transaction

  beforeEach(() => {
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn()
    }
    db.sequelize.transaction.mockResolvedValue(transaction)
    getDaxsForSfi23QuarterlyStatement.mockResolvedValue(['dax1', 'dax2'])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getDaxsForSfi23QuarterlyStatement', async () => {
    await getVerifiedDaxsSfi23QuarterlyStatements()
    expect(getDaxsForSfi23QuarterlyStatement).toHaveBeenCalledWith(transaction)
  })

  test('should call updateDaxsForStartPublish', async () => {
    await getVerifiedDaxsSfi23QuarterlyStatements()
    expect(updateDaxsForStartPublish).toHaveBeenCalledWith(['dax1', 'dax2'], transaction)
  })

  test('should call transaction.commit', async () => {
    await getVerifiedDaxsSfi23QuarterlyStatements()
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should return the daxs', async () => {
    const result = await getVerifiedDaxsSfi23QuarterlyStatements()
    expect(result).toEqual(['dax1', 'dax2'])
  })
})
