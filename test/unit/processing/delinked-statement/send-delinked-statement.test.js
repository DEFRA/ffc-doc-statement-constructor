const sendDelinkedStatement = require('../../../../app/processing/delinked-statement/send-delinked-statement')
jest.mock('../../../../app/processing/delinked-statement/publish-delinked-statement')
const publishDelinkedStatement = require('../../../../app/processing/delinked-statement/publish-delinked-statement')
jest.mock('ffc-alerting-utils', () => ({
  dataProcessingAlert: jest.fn()
}))
const { dataProcessingAlert } = require('ffc-alerting-utils')

describe('sendDelinkedStatement', () => {
  const statement = { paymentReference: 'D365123' }
  let consoleErrorSpy

  beforeEach(() => {
    jest.clearAllMocks()
    publishDelinkedStatement.mockResolvedValue()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  test('should call publishDelinkedStatement with the provided statement and not call alert on success', async () => {
    await sendDelinkedStatement(statement)
    expect(publishDelinkedStatement).toHaveBeenCalledWith(statement)
    expect(dataProcessingAlert).not.toHaveBeenCalled()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test.each([
    {
      name: 'calls dataProcessingAlert when publishDelinkedStatement fails',
      publishError: new Error('Publish failed'),
      alertError: null,
      expectedConsoleCalls: 0
    },
    {
      name: 'logs an error if dataProcessingAlert itself throws',
      publishError: new Error('Publish failed'),
      alertError: new Error('Alert failed'),
      expectedConsoleCalls: 1
    }
  ])('$name', async ({ publishError, alertError, expectedConsoleCalls }) => {
    publishDelinkedStatement.mockRejectedValueOnce(publishError)
    if (alertError) {
      dataProcessingAlert.mockRejectedValueOnce(alertError)
    } else {
      dataProcessingAlert.mockResolvedValueOnce()
    }

    await expect(sendDelinkedStatement(statement)).rejects.toThrowError(
      `Failed to send statement for D365 Payment Reference: ${statement.paymentReference}`
    )

    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const alertArg = dataProcessingAlert.mock.calls[0][0]
    expect(alertArg).toMatchObject({
      process: 'sendDelinkedStatement',
      paymentReference: statement.paymentReference,
      error: publishError,
      message: `Failed to send statement for D365 Payment Reference: ${statement.paymentReference}`
    })

    expect(consoleErrorSpy).toHaveBeenCalledTimes(expectedConsoleCalls)
    if (expectedConsoleCalls > 0) {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Failed to send statement for D365 Payment Reference: ${statement.paymentReference}`,
        { originalError: publishError, alertError }
      )
    }
  })
})
