const publishDelinkedStatement = require('../../../../app/processing/delinked-statement/publish-delinked-statement')

const util = require('util')

const config = require('../../../../app/config')

jest.mock('../../../../app/messaging/send-message')
const sendMessage = require('../../../../app/messaging/send-message')

describe('publishDelinkedStatement', () => {
  test('should call sendMessage with correct parameters', async () => {
    const delinkedStatement = { /* mock statement object */ }

    await publishDelinkedStatement(delinkedStatement)

    expect(sendMessage).toHaveBeenCalledWith(
      delinkedStatement,
      'uk.gov.doc.delinked-statement',
      config.statementTopic
    )
  })

  test('should log the sent statement', async () => {
    const delinkedStatement = { /* mock statement object */ }
    const consoleLogSpy = jest.spyOn(console, 'log')
    const utilInspectSpy = jest.spyOn(util, 'inspect')

    await publishDelinkedStatement(delinkedStatement)

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Delinked Payment Statement sent:',
      utilInspectSpy(delinkedStatement, false, null, true)
    )
  })
})
