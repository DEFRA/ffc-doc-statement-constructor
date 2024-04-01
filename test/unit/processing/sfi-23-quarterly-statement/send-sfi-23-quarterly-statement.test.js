const sendSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/send-sfi-23-quarterly-statement')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/publish-sfi23-quarterly-statement')
const publishSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/publish-sfi23-quarterly-statement')

describe('sendSfi23QuarterlyStatement', () => {
  test('should call publishSfi23QuarterlyStatement with the provided statement', async () => {
    const statement = { paymentReference: 'DAX123' }
    await sendSfi23QuarterlyStatement(statement)

    expect(publishSfi23QuarterlyStatement).toHaveBeenCalledWith(statement)
  })

  test('should throw an error with the payment reference when publishSfi23QuarterlyStatement fails', async () => {
    const statement = { paymentReference: 'DAX123' }
    const error = new Error('Publish failed')
    publishSfi23QuarterlyStatement.mockRejectedValueOnce(error)

    await expect(sendSfi23QuarterlyStatement(statement)).rejects.toThrowError(
      `Failed to send statement for Dax Payment Reference: ${statement.paymentReference}`
    )
  })
})
