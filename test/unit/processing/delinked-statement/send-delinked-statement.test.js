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
  test('should call dataProcessingAlert when publishDelinkedStatement fails', async () => {
    const error = new Error('Publish failed')
    publishDelinkedStatement.mockRejectedValueOnce(error)
    dataProcessingAlert.mockResolvedValue()
    await expect(sendDelinkedStatement(statement)).rejects.toThrowError(
      `Failed to send statement for D365 Payment Reference: ${statement.paymentReference}`
    )
    expect(dataProcessingAlert).toHaveBeenCalledWith({
      process: 'sendDelinkedStatement',
      paymentReference: statement.paymentReference,
      error,
      message: `Failed to send statement for D365 Payment Reference: ${statement.paymentReference}`
    }, expect.anything())
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
  test('should log an error if dataProcessingAlert itself throws', async () => {
    const publishError = new Error('Publish failed')
    const alertError = new Error('Alert failed')
    publishDelinkedStatement.mockRejectedValueOnce(publishError)
    dataProcessingAlert.mockRejectedValueOnce(alertError)
    await expect(sendDelinkedStatement(statement)).rejects.toThrowError(
      `Failed to send statement for D365 Payment Reference: ${statement.paymentReference}`
    )
    expect(dataProcessingAlert).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Failed to send statement for D365 Payment Reference: ${statement.paymentReference}`,
      { originalError: publishError, alertError }
    )
  })
})
