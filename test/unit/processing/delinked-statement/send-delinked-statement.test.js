const sendDelinkedStatement = require('../../../../app/processing/delinked-statement/send-delinked-statement')

jest.mock('../../../../app/processing/delinked-statement/publish-delinked-statement')
const publishDelinkedStatement = require('../../../../app/processing/delinked-statement/publish-delinked-statement')

describe('sendDelinkedStatement', () => {
  test('should call publishDelinkedStatement with the provided statement', async () => {
    const statement = { paymentReference: 'D365123' }
    await sendDelinkedStatement(statement)

    expect(publishDelinkedStatement).toHaveBeenCalledWith(statement)
  })

  test('should throw an error with the payment reference when publishDelinkedStatement fails', async () => {
    const statement = { paymentReference: 'D365123' }
    const error = new Error('Publish failed')
    publishDelinkedStatement.mockRejectedValueOnce(error)

    await expect(sendDelinkedStatement(statement)).rejects.toThrowError(
      `Failed to send statement for D365 Payment Reference: ${statement.paymentReference}`
    )
  })
})
