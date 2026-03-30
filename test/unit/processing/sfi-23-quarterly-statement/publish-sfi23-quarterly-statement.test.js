const publishSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/publish-sfi23-quarterly-statement')

const config = require('../../../../app/config')

jest.mock('../../../../app/messaging/send-message')
const sendMessage = require('../../../../app/messaging/send-message')

describe('publishSfi23QuarterlyStatement', () => {
  test('should call sendMessage with correct parameters', async () => {
    const sfi23QuarterlyStatement = { /* mock statement object */ }
    await publishSfi23QuarterlyStatement(sfi23QuarterlyStatement)
    expect(sendMessage).toHaveBeenCalledWith(
      sfi23QuarterlyStatement,
      'uk.gov.doc.sfi-23-quarterly-statement',
      config.statementTopic
    )
  })

  test('should log the sent statement', async () => {
    const sfi23QuarterlyStatement = { sbi: '123', frn: '456' }
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    await publishSfi23QuarterlyStatement(sfi23QuarterlyStatement)
    expect(logSpy).toHaveBeenCalledWith(
    `Sfi-23 Quarterly Statement sent: sbi: ${sfi23QuarterlyStatement.sbi}, frn: ${sfi23QuarterlyStatement.frn}`
    )
    logSpy.mockRestore()
  })
})
