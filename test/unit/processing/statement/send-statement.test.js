jest.mock('../../../../app/processing/statement/publish-statement')
const publishStatement = require('../../../../app/processing/statement/publish-statement')

const sendStatement = require('../../../../app/processing/statement/send-statement')

const statement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))

describe('send statement', () => {
  beforeEach(() => {
    publishStatement.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call updateScheduleByScheduleId', async () => {
    await sendStatement(statement)
  })

  test('should call publishStatement', async () => {
    await sendStatement(statement)
    expect(publishStatement).toHaveBeenCalled()
  })

  test('should call publishStatement once', async () => {
    await sendStatement(statement)
    expect(publishStatement).toHaveBeenCalledTimes(1)
  })

  test('should call publishStatement with statement', async () => {
    await sendStatement(statement)
    expect(publishStatement).toHaveBeenCalledWith(statement)
  })

  test('should throw when publishStatement rejects ', async () => {
    publishStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(statement)
    }
    await expect(wrapper).rejects.toThrow()
  })

  test('should throw error when publishStatement rejects ', async () => {
    publishStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(statement)
    }
    await expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with message which starts with "Failed to send statement for invoiceNumber" when publishStatement rejects', async () => {
    publishStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(statement)
    }
    await expect(wrapper).rejects.toThrow(`Failed to send statement for ${statement.payments[0]?.invoiceNumber}`)
  })
})
