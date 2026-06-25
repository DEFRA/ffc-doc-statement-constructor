const mockSendMessage = jest.fn()
const mockCloseConnection = jest.fn()

jest.mock('ffc-messaging', () => ({
  MessageSender: jest.fn().mockImplementation(() => ({
    sendMessage: mockSendMessage,
    closeConnection: mockCloseConnection
  }))
}))

jest.mock('../../../app/messaging/create-message')
const { MessageSender } = require('ffc-messaging')
const createMessage = require('../../../app/messaging/create-message')
const sendMessage = require('../../../app/messaging/send-message')

describe('send message', () => {
  let statement, config, options, type, message

  beforeEach(async () => {
    await sendMessage.closeConnection()
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
    ['mockSendMessage with message', () => expect(mockSendMessage).toHaveBeenCalledWith(message)]
  ])('%s', async (_desc, assertion) => {
    await sendMessage(statement, type, config, options)
    assertion()
  })

  test('reuses the same MessageSender across multiple calls', async () => {
    await sendMessage(statement, type, config, options)
    await sendMessage(statement, type, config, options)
    expect(MessageSender).toHaveBeenCalledTimes(1)
    expect(mockSendMessage).toHaveBeenCalledTimes(2)
  })

  test('closes and recreates the sender once when sendMessage fails', async () => {
    const sendError = new Error('send failed')
    mockSendMessage.mockRejectedValueOnce(sendError).mockResolvedValueOnce()

    await sendMessage(statement, type, config, options)

    expect(MessageSender).toHaveBeenCalledTimes(2)
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
    expect(mockSendMessage).toHaveBeenCalledTimes(2)
  })

  describe('closeConnection', () => {
    test('closes the shared sender connection', async () => {
      await sendMessage(statement, type, config, options)
      await sendMessage.closeConnection()
      expect(mockCloseConnection).toHaveBeenCalledTimes(1)
    })

    test('creates a new sender after connection is closed', async () => {
      await sendMessage(statement, type, config, options)
      await sendMessage.closeConnection()
      jest.clearAllMocks()
      await sendMessage(statement, type, config, options)
      expect(MessageSender).toHaveBeenCalledTimes(1)
    })

    test('does nothing if no sender exists', async () => {
      await sendMessage.closeConnection()
      expect(mockCloseConnection).not.toHaveBeenCalled()
    })
  })
})
