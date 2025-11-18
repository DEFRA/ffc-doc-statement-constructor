const mockSendMessage = jest.fn()
const mockCloseConnection = jest.fn()

jest.mock('ffc-messaging', () => ({
  MessageSender: jest.fn().mockImplementation(() => ({
    sendMessage: mockSendMessage,
    closeConnection: mockCloseConnection
  }))
}))

jest.mock('../../../app/messaging/create-message')
const createMessage = require('../../../app/messaging/create-message')
const sendMessage = require('../../../app/messaging/send-message')

describe('send message', () => {
  let statement, config, options, type, message

  beforeEach(() => {
    jest.clearAllMocks()

    statement = structuredClone(require('../../mock-objects/mock-statement'))
    type = 'uk.gov.doc.statement'
    config = { source: 'ffc-doc-statement-constructor' }
    options = {}

    message = { body: statement, type, source: config.source, ...options }
    createMessage.mockReturnValue(message)
  })

  test.each([
    ['createMessage', () => expect(createMessage).toHaveBeenCalled()],
    ['createMessage once', () => expect(createMessage).toHaveBeenCalledTimes(1)],
    ['createMessage with correct args', () => expect(createMessage).toHaveBeenCalledWith(statement, type, config.source, options)],
    ['mockSendMessage', () => expect(mockSendMessage).toHaveBeenCalled()],
    ['mockSendMessage once', () => expect(mockSendMessage).toHaveBeenCalledTimes(1)],
    ['mockSendMessage with message', () => expect(mockSendMessage).toHaveBeenCalledWith(message)],
    ['mockCloseConnection', () => expect(mockCloseConnection).toHaveBeenCalled()],
    ['mockCloseConnection once', () => expect(mockCloseConnection).toHaveBeenCalledTimes(1)]
  ])('%s', async (_desc, assertion) => {
    await sendMessage(statement, type, config, options)
    assertion()
  })
})
