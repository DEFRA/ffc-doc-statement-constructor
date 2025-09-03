const path = require('path')

describe('resetD365UnCompletePublishByDaxId', () => {
  const modulePath = path.resolve(__dirname, '../../../../app/processing/delinked-statement/reset-d365-un-complete-publish-by-d365-id.js')
  const dataModulePath = path.resolve(__dirname, '../../../../app/data')
  const alertsModulePath = path.resolve(__dirname, '../../../../app/utility/processing-alerts')

  let mockUpdate
  let mockDataProcessingAlert
  let originalConsoleError

  beforeAll(() => {
    originalConsoleError = console.error
  })

  beforeEach(() => {
    jest.resetModules()
    mockUpdate = jest.fn()
    mockDataProcessingAlert = jest.fn()
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = originalConsoleError
  })

  test('should call db.d365.update and not alert on success', async () => {
    mockUpdate.mockResolvedValue([1])
    jest.doMock(dataModulePath, () => ({ d365: { update: mockUpdate } }), { virtual: false })
    jest.doMock(alertsModulePath, () => ({ dataProcessingAlert: mockDataProcessingAlert }), { virtual: false })

    const resetFn = require(modulePath)
    const d365Id = 'D365-123'
    await expect(resetFn(d365Id)).resolves.toBeUndefined()

    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledWith({ startPublish: null }, {
      where: {
        d365Id,
        completePublish: null
      }
    })
    expect(mockDataProcessingAlert).not.toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
  })

  test('should alert and rethrow preserving original error when db update throws', async () => {
    const originalErr = new Error('db failure')
    mockUpdate.mockRejectedValue(originalErr)
    mockDataProcessingAlert.mockResolvedValue()

    jest.doMock(dataModulePath, () => ({ d365: { update: mockUpdate } }), { virtual: false })
    jest.doMock(alertsModulePath, () => ({ dataProcessingAlert: mockDataProcessingAlert }), { virtual: false })

    const resetFn = require(modulePath)
    const d365Id = 'D365-456'
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
      expect(thrown.cause).toBe(originalErr)
    } else {
      expect(thrown.message).toContain(originalErr.message)
    }

    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(1)
    const alertArg = mockDataProcessingAlert.mock.calls[0][0]
    expect(alertArg).toMatchObject({
      process: 'resetD365UnCompletePublishByDaxId',
      d365Id,
      error: originalErr,
      message: expectedMessage
    })
    expect(console.error).not.toHaveBeenCalled()
  })

  test('should log both original and alert errors when alerting fails, and still rethrow preserving original', async () => {
    const originalErr = new Error('db failure 2')
    const alertErr = new Error('alert failure')
    mockUpdate.mockRejectedValue(originalErr)
    mockDataProcessingAlert.mockRejectedValue(alertErr)

    jest.doMock(dataModulePath, () => ({ d365: { update: mockUpdate } }), { virtual: false })
    jest.doMock(alertsModulePath, () => ({ dataProcessingAlert: mockDataProcessingAlert }), { virtual: false })

    const resetFn = require(modulePath)
    const d365Id = 'D365-789'
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
      expect(thrown.cause).toBe(originalErr)
    } else {
      expect(thrown.message).toContain(originalErr.message)
    }

    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(1)
    const alertArg = mockDataProcessingAlert.mock.calls[0][0]
    expect(alertArg).toMatchObject({
      process: 'resetD365UnCompletePublishByDaxId',
      d365Id,
      error: originalErr,
      message: expectedMessage
    })

    expect(console.error).toHaveBeenCalledTimes(1)
    const callArgs = console.error.mock.calls[0]
    expect(callArgs[0]).toEqual(`${expectedMessage}: ${originalErr.message}`)
    expect(callArgs[1]).toMatchObject({
      originalError: originalErr,
      alertError: alertErr
    })
  })
})
