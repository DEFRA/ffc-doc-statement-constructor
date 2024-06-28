jest.mock('../../../../app/processing/sfi-23-advanced-statement/publish-sfi-23-advanced-statement')
const publishSfi23AdvancedStatement = require('../../../../app/processing/sfi-23-advanced-statement/publish-sfi-23-advanced-statement')

const sendSfi23AdvancedStatement = require('../../../../app/processing/sfi-23-advanced-statement/send-sfi-23-advanced-statement')

const statement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))

describe('send statement', () => {
  beforeEach(() => {
    publishSfi23AdvancedStatement.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call updateScheduleByScheduleId', async () => {
    await sendSfi23AdvancedStatement(statement)
  })

  test('should call publishSfi23AdvancedStatement', async () => {
    await sendSfi23AdvancedStatement(statement)
    expect(publishSfi23AdvancedStatement).toHaveBeenCalled()
  })

  test('should call publishSfi23AdvancedStatement once', async () => {
    await sendSfi23AdvancedStatement(statement)
    expect(publishSfi23AdvancedStatement).toHaveBeenCalledTimes(1)
  })

  test('should call publishSfi23AdvancedStatement with statement', async () => {
    await sendSfi23AdvancedStatement(statement)
    expect(publishSfi23AdvancedStatement).toHaveBeenCalledWith(statement)
  })

  test('should throw when publishSfi23AdvancedStatement rejects ', async () => {
    publishSfi23AdvancedStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendSfi23AdvancedStatement(statement)
    }
    await expect(wrapper).rejects.toThrow()
  })

  test('should throw error when publishSfi23AdvancedStatement rejects ', async () => {
    publishSfi23AdvancedStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendSfi23AdvancedStatement(statement)
    }
    await expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with message which starts with "Failed to send statement for invoiceNumber" when publishSfi23AdvancedStatement rejects', async () => {
    publishSfi23AdvancedStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendSfi23AdvancedStatement(statement)
    }
    await expect(wrapper).rejects.toThrow(`Failed to send statement for ${statement.payments[0]?.invoiceNumber}`)
  })
})
