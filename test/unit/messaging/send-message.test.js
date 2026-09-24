const mockSendServiceBusMessage = jest.fn()
const mockClose = jest.fn()

const mockSender = {
  close: mockClose
}

jest.mock('../../../app/messaging/service-bus', () => ({
  getSender: jest.fn().mockReturnValue(mockSender),
  sendMessage: (...args) => mockSendServiceBusMessage(...args)
}))

jest.mock('../../../app/messaging/create-message')
const createMessage = require('../../../app/messaging/create-message')
const serviceBus = require('../../../app/messaging/service-bus')
const sendMessage = require('../../../app/messaging/send-message')

describe('send message', () => {
  let statement, config, options, type, message

  beforeEach(async () => {
    await sendMessage.closeConnection()
    jest.clearAllMocks()

    statement = structuredClone(require('../../mock-objects/mock-statement'))
    type = 'uk.gov.doc.statement'
    config = { source: 'ffc-doc-statement-constructor', address: 'test-topic' }
    options = {}

    message = { body: statement, type, source: config.source, ...options }
    createMessage.mockReturnValue(message)
  })

  test.each([
    ['createMessage', () => expect(createMessage).toHaveBeenCalled()],
    ['createMessage once', () => expect(createMessage).toHaveBeenCalledTimes(1)],
    ['createMessage with correct args', () => expect(createMessage).toHaveBeenCalledWith(statement, type, config.source, options)],
    ['sendServiceBusMessage', () => expect(mockSendServiceBusMessage).toHaveBeenCalled()],
    ['sendServiceBusMessage once', () => expect(mockSendServiceBusMessage).toHaveBeenCalledTimes(1)],
    ['sendServiceBusMessage with sender, message and options', () => expect(mockSendServiceBusMessage).toHaveBeenCalledWith(mockSender, message, options)]
  ])('%s', async (_desc, assertion) => {
    await sendMessage(statement, type, config, options)
    assertion()
  })

  test('reuses the same sender across multiple calls', async () => {
    await sendMessage(statement, type, config, options)
    await sendMessage(statement, type, config, options)
    expect(serviceBus.getSender).toHaveBeenCalledTimes(1)
    expect(mockSendServiceBusMessage).toHaveBeenCalledTimes(2)
  })

  test('closes and recreates the sender once when sendMessage fails', async () => {
    const sendError = new Error('send failed')
    mockSendServiceBusMessage.mockRejectedValueOnce(sendError).mockResolvedValueOnce()

    await sendMessage(statement, type, config, options)

    expect(serviceBus.getSender).toHaveBeenCalledTimes(2)
    expect(mockClose).toHaveBeenCalledTimes(1)
    expect(mockSendServiceBusMessage).toHaveBeenCalledTimes(2)
  })

  test('logs a warning when sender fails', async () => {
    const sendError = new Error('connection timeout')
    mockSendServiceBusMessage.mockRejectedValueOnce(sendError).mockResolvedValueOnce()
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation()

    await sendMessage(statement, type, config, options)

    expect(warnSpy).toHaveBeenCalledWith('MessageSender failed, closing and retrying:', 'connection timeout')
    warnSpy.mockRestore()
  })

  describe('closeConnection', () => {
    test('closes the shared sender connection', async () => {
      await sendMessage(statement, type, config, options)
      await sendMessage.closeConnection()
      expect(mockClose).toHaveBeenCalledTimes(1)
    })

    test('creates a new sender after connection is closed', async () => {
      await sendMessage(statement, type, config, options)
      await sendMessage.closeConnection()
      jest.clearAllMocks()
      await sendMessage(statement, type, config, options)
      expect(serviceBus.getSender).toHaveBeenCalledTimes(1)
    })

    test('does nothing if no sender exists', async () => {
      await sendMessage.closeConnection()
      expect(mockClose).not.toHaveBeenCalled()
    })
  })
})
