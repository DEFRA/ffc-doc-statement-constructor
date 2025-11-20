const path = require('path')

jest.mock('ffc-alerting-utils', () => ({
  dataProcessingAlert: jest.fn()
}))

describe('resetD365UnCompletePublishByDaxId', () => {
  const modulePath = path.resolve(__dirname, '../../../../app/processing/delinked-statement/reset-d365-un-complete-publish-by-d365-id.js')
  const dataModulePath = path.resolve(__dirname, '../../../../app/data')

  let mockUpdate
  let mockDataProcessingAlert
  let originalConsoleError

  beforeAll(() => {
    originalConsoleError = console.error
  })

  beforeEach(() => {
    jest.resetModules()
    mockUpdate = jest.fn()

    const { dataProcessingAlert } = require('ffc-alerting-utils')
    mockDataProcessingAlert = dataProcessingAlert
    mockDataProcessingAlert.mockReset()

    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = originalConsoleError
  })

  test('should call db.d365.update and not alert on success', async () => {
    mockUpdate.mockResolvedValue([1])
    jest.doMock(dataModulePath, () => ({ d365: { update: mockUpdate } }), { virtual: false })

    const resetFn = require(modulePath)
    const d365Id = 'D365-123'
    await expect(resetFn(d365Id)).resolves.toBeUndefined()

    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledWith({ startPublish: null }, {
      where: { d365Id, completePublish: null }
    })
    expect(mockDataProcessingAlert).not.toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
  })

  test.each([
    {
      name: 'alerts and rethrows when db update throws',
      updateError: new Error('db failure'),
      alertError: null,
      expectedConsoleCalls: 0
    },
    {
      name: 'logs both original and alert errors when alerting fails',
      updateError: new Error('db failure 2'),
      alertError: new Error('alert failure'),
      expectedConsoleCalls: 1
    }
  ])('$name', async ({ updateError, alertError, expectedConsoleCalls }) => {
    mockUpdate.mockRejectedValue(updateError)
    if (alertError) {
      mockDataProcessingAlert.mockRejectedValue(alertError)
    } else {
      mockDataProcessingAlert.mockResolvedValue()
    }

    jest.doMock(dataModulePath, () => ({ d365: { update: mockUpdate } }), { virtual: false })

    const resetFn = require(modulePath)
    const d365Id = updateError.message.includes('2') ? 'D365-789' : 'D365-456'
    const expectedMessage = `Error resetting uncomplete publish for D365 ID ${d365Id}`

    let thrown
    try {
      await resetFn(d365Id)
    } catch (err) {
      thrown = err
    }

    expect(thrown).toBeDefined()
    expect(thrown.message).toEqual(expect.stringContaining(expectedMessage))
    if ('cause' in thrown) {
      expect(thrown.cause).toBe(updateError)
    } else {
      expect(thrown.message).toContain(updateError.message)
    }

    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(1)
    const alertArg = mockDataProcessingAlert.mock.calls[0][0]
    expect(alertArg).toMatchObject({
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
