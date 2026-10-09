const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock()

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close
}))
jest.mock('../../../../app/processing/delinked-statement/get-d365-for-delinked-statement')
jest.mock('../../../../app/processing/delinked-statement/update-d365-for-start-publish')

const getD365ForDelinkedStatement = require('../../../../app/processing/delinked-statement/get-d365-for-delinked-statement')
const updateD365ForStartPublish = require('../../../../app/processing/delinked-statement/update-d365-for-start-publish')
const getVerifiedD365DelinkedStatements = require('../../../../app/processing/delinked-statement/get-verified-d365-delinked-statements')

describe('getVerifiedD365DelinkedStatements', () => {
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test.each([
    {
      name: 'returns d365 data on successful execution',
      d365Mock: [{ id: 1, name: 'D365 Data' }],
      getD365Error: false,
      updateError: false,
      expectedResult: [{ id: 1, name: 'D365 Data' }],
      shouldRollback: false
    },
    {
      name: 'rollbacks and returns empty array if getD365ForDelinkedStatement fails',
      d365Mock: [],
      getD365Error: true,
      updateError: false,
      expectedResult: [],
      shouldRollback: true
    },
    {
      name: 'rollbacks and returns empty array if updateD365ForStartPublish fails',
      d365Mock: [{ id: 1, name: 'D365 Data' }],
      getD365Error: false,
      updateError: true,
      expectedResult: [],
      shouldRollback: true
    }
  ])('$name', async ({ d365Mock, getD365Error, updateError, expectedResult, shouldRollback }) => {
    if (getD365Error) {
      getD365ForDelinkedStatement.mockRejectedValue(new Error('Failed to get D365 data'))
    } else {
      getD365ForDelinkedStatement.mockResolvedValue(d365Mock)
    }

    if (updateError) {
      updateD365ForStartPublish.mockRejectedValue(new Error('Failed to update D365 data'))
    } else {
      updateD365ForStartPublish.mockResolvedValue()
    }

    const result = await getVerifiedD365DelinkedStatements()

    expect(mockDb.transaction).toHaveBeenCalled()
    expect(getD365ForDelinkedStatement).toHaveBeenCalledWith(transaction)

    if (!getD365Error) {
      expect(updateD365ForStartPublish).toHaveBeenCalledWith(d365Mock, transaction)
    } else {
      expect(updateD365ForStartPublish).not.toHaveBeenCalled()
    }

    if (shouldRollback) {
      expect(transaction.rollback).toHaveBeenCalled()
      expect(transaction.commit).not.toHaveBeenCalled()
    } else {
      expect(transaction.commit).toHaveBeenCalled()
      expect(transaction.rollback).not.toHaveBeenCalled()
    }

    expect(result).toEqual(expectedResult)
  })
})
