const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['d365'])

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
const resetD365UnCompletePublishByDaxId = require('../../../../app/processing/delinked-statement/reset-d365-un-complete-publish-by-d365-id')

describe('resetD365UnCompletePublishByDaxId', () => {
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

  test('clears startPublish only where publishing has not completed, and does not alert', async () => {
    mockDb.builder.resolves(1)
    const d365Id = 'D365-123'

    await expect(resetD365UnCompletePublishByDaxId(d365Id)).resolves.toBeUndefined()

    expect(mockDb.tables.d365).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ d365Id })
    expect(mockDb.builder.whereNull).toHaveBeenCalledWith('completePublish')
    expect(mockDb.builder.update).toHaveBeenCalledWith({ startPublish: null })
    expect(dataProcessingAlert).not.toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
  })

  test.each([
    {
      name: 'alerts and rethrows when the update throws',
      d365Id: 'D365-456',
      updateError: new Error('db failure'),
      alertError: null,
      expectedConsoleCalls: 0
    },
    {
      name: 'logs both original and alert errors when alerting fails',
      d365Id: 'D365-789',
      updateError: new Error('db failure 2'),
      alertError: new Error('alert failure'),
      expectedConsoleCalls: 1
    }
  ])('$name', async ({ d365Id, updateError, alertError, expectedConsoleCalls }) => {
    mockDb.builder.rejects(updateError)
    if (alertError) {
      dataProcessingAlert.mockRejectedValue(alertError)
    } else {
      dataProcessingAlert.mockResolvedValue()
    }

    const expectedMessage = `Error resetting uncomplete publish for D365 ID ${d365Id}`

    let thrown
    try {
      await resetD365UnCompletePublishByDaxId(d365Id)
    } catch (err) {
      thrown = err
    }

    expect(thrown).toBeDefined()
    expect(thrown.message).toEqual(expect.stringContaining(expectedMessage))
    expect(thrown.cause).toBe(updateError)

    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    expect(dataProcessingAlert.mock.calls[0][0]).toMatchObject({
      process: 'resetD365UnCompletePublishByDaxId',
      d365Id,
      error: updateError,
      message: expectedMessage
    })

    expect(console.error).toHaveBeenCalledTimes(expectedConsoleCalls)
    if (expectedConsoleCalls > 0) {
      const callArgs = console.error.mock.calls[0]
      expect(callArgs[0]).toEqual(`${expectedMessage}: ${updateError.message}`)
      expect(callArgs[1]).toMatchObject({
        originalError: updateError,
        alertError
      })
    }
  })
})
