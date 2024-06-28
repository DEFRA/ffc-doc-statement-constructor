const sendMessage = require('../../../../app/messaging/send-message')
jest.mock('../../../../app/messaging/send-message')

const config = require('../../../../app/config')
jest.mock('../../../../app/config')

const type = 'uk.gov.doc.sfi-23-advanced-statement'
const mockStatement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))
const publishSfi23AdvancedStatement = require('../../../../app/processing/sfi-23-advanced-statement/publish-sfi-23-advanced-statement')

describe('publish statement', () => {
  beforeEach(() => {
    config.statementTopic = 'statement-topic'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call sendMessage', async () => {
    await publishSfi23AdvancedStatement(mockStatement)
    expect(sendMessage).toHaveBeenCalled()
  })

  test('should call sendMessage once', async () => {
    await publishSfi23AdvancedStatement(mockStatement)
    expect(sendMessage).toHaveBeenCalledTimes(1)
  })

  test('should call sendMessage with mockStatement, type and config.statementTopic', async () => {
    await publishSfi23AdvancedStatement(mockStatement)
    expect(sendMessage).toHaveBeenCalledWith(mockStatement, type, config.statementTopic)
  })
})
