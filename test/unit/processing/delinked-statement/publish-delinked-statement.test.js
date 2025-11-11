const publishDelinkedStatement = require('../../../../app/processing/delinked-statement/publish-delinked-statement')
const util = require('util')
const config = require('../../../../app/config')

jest.mock('../../../../app/messaging/send-message')
const sendMessage = require('../../../../app/messaging/send-message')

describe('publishDelinkedStatement', () => {
  const delinkedStatement = { id: 'stmt123', amount: 100 }

  let consoleLogSpy
  let utilInspectSpy

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    utilInspectSpy = jest.spyOn(util, 'inspect')
    jest.clearAllMocks()
  })

  test.each([
    {
      name: 'calls sendMessage with correct parameters',
      verify: () => {
        expect(sendMessage).toHaveBeenCalledWith(
          delinkedStatement,
          'uk.gov.doc.delinked-statement',
          config.statementTopic
        )
      }
    },
    {
      name: 'logs the sent statement',
      verify: () => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          'Delinked Payment Statement sent:',
          utilInspectSpy(delinkedStatement, false, null, true)
        )
      }
    }
  ])('$name', async ({ verify }) => {
    await publishDelinkedStatement(delinkedStatement)
    verify()
  })
})
