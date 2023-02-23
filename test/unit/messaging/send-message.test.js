const mockSendMessage = jest.fn()
const mockCloseConnection = jest.fn()
jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
        closeConnection: mockCloseConnection
      }
    })
  }
})

jest.mock('../../../app/messaging/create-message')
const createMessage = require('../../../app/messaging/create-message')

const sendMessage = require('../../../app/messaging/send-message')

let statement, config, options, type

describe('send message', () => {
  beforeEach(() => {
    statement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-statement')))

    const body = { ...statement }
    type = 'uk.gov.pay.statement'
    config = {
      source: 'ffc-pay-statement-constructor'
    }
    options = {}

    createMessage.mockReturnValue({
      body,
      type,
      source: config.source,
      ...options
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call createMessage', async () => {
    await sendMessage(statement, type, config, options)
    expect(createMessage).toHaveBeenCalled()
  })

  test('should call createMessage once', async () => {
    await sendMessage(statement, type, config, options)
    expect(createMessage).toHaveBeenCalledTimes(1)
  })

  test('should call createMessage with statement, config.source and options', async () => {
    await sendMessage(statement, type, config, options)
    expect(createMessage).toHaveBeenCalledWith(statement, type, config.source, options)
  })

  test('should call mockSendMessage', async () => {
    await sendMessage(statement, type, config, options)
    expect(mockSendMessage).toHaveBeenCalled()
  })

  test('should call mockSendMessage once', async () => {
    await sendMessage(statement, type, config, options)
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
  })

  test('should call mockSendMessage with message', async () => {
    const message = createMessage()
    await sendMessage(statement, type, config, options)
    expect(mockSendMessage).toHaveBeenCalledWith(message)
  })

  test('should call mockCloseConnection', async () => {
    await sendMessage(statement, type, config, options)
    expect(mockCloseConnection).toHaveBeenCalled()
  })

  test('should call mockCloseConnection once', async () => {
    await sendMessage(statement, type, config, options)
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  })
})
