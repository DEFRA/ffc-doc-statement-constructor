const publishDelinkedStatement = require('../../../../app/processing/delinked-statement/publish-delinked-statement')
const config = require('../../../../app/config')

jest.mock('../../../../app/messaging/send-message')
const sendMessage = require('../../../../app/messaging/send-message')

describe('publishDelinkedStatement', () => {
  const delinkedStatement = { sbi: 123, frn: 456 }

  let consoleLogSpy

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
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
          'Delinked Payment Statement sent: sbi: 123, frn: 456'
        )
      }
    }
  ])('$name', async ({ verify }) => {
    await publishDelinkedStatement(delinkedStatement)
    verify()
  })
})
