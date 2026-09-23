const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock()

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close
}))
jest.mock('../../../../app/processing/sfi-23-quarterly-statement/get-daxs-for-sfi-23-quarterly-statement', () => jest.fn())
jest.mock('../../../../app/processing/sfi-23-quarterly-statement/update-daxs-for-start-publish', () => jest.fn())

const getDaxsForSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/get-daxs-for-sfi-23-quarterly-statement')
const updateDaxsForStartPublish = require('../../../../app/processing/sfi-23-quarterly-statement/update-daxs-for-start-publish')
const getVerifiedDaxsSfi23QuarterlyStatements = require('../../../../app/processing/sfi-23-quarterly-statement/get-verified-daxs-sfi-23-quarterly-statements')

describe('getVerifiedDaxsSfi23QuarterlyStatements', () => {
  const transaction = mockDb.trx
  let originalConsoleError

  beforeAll(() => {
    originalConsoleError = console.error
  })

  beforeEach(() => {
    jest.clearAllMocks()
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = originalConsoleError
  })

  test.each([
    {
      name: 'returns the daxs and commits on success',
      daxs: [{ daxId: 1 }, { daxId: 2 }],
      getError: null,
      updateError: null,
      expectedResult: [{ daxId: 1 }, { daxId: 2 }],
      shouldRollback: false
    },
    {
      name: 'rolls back and returns an empty array when fetching daxs fails',
      daxs: [],
      getError: new Error('Failed to get daxs'),
      updateError: null,
      expectedResult: [],
      shouldRollback: true
    },
    {
      name: 'rolls back and returns an empty array when marking start publish fails',
      daxs: [{ daxId: 1 }],
      getError: null,
      updateError: new Error('Failed to update daxs'),
      expectedResult: [],
      shouldRollback: true
    }
  ])('$name', async ({ daxs, getError, updateError, expectedResult, shouldRollback }) => {
    if (getError) {
      getDaxsForSfi23QuarterlyStatement.mockRejectedValue(getError)
    } else {
      getDaxsForSfi23QuarterlyStatement.mockResolvedValue(daxs)
    }

    if (updateError) {
      updateDaxsForStartPublish.mockRejectedValue(updateError)
    } else {
      updateDaxsForStartPublish.mockResolvedValue()
    }

    const result = await getVerifiedDaxsSfi23QuarterlyStatements()

    expect(mockDb.transaction).toHaveBeenCalledTimes(1)
    expect(getDaxsForSfi23QuarterlyStatement).toHaveBeenCalledWith(transaction)

    if (getError) {
      expect(updateDaxsForStartPublish).not.toHaveBeenCalled()
    } else {
      expect(updateDaxsForStartPublish).toHaveBeenCalledWith(daxs, transaction)
    }

    if (shouldRollback) {
      expect(transaction.rollback).toHaveBeenCalledTimes(1)
      expect(transaction.commit).not.toHaveBeenCalled()
      expect(console.error).toHaveBeenCalledWith('Could not start sfi-23 quarterly statements', getError ?? updateError)
    } else {
      expect(transaction.commit).toHaveBeenCalledTimes(1)
      expect(transaction.rollback).not.toHaveBeenCalled()
      expect(console.error).not.toHaveBeenCalled()
    }

    expect(result).toEqual(expectedResult)
  })
})
