jest.mock('ffc-pay-event-publisher', () => {
  return {
    EventPublisher: jest.fn().mockImplementation(function () {
      this.publishEvents = jest.fn().mockResolvedValue(undefined)
    })
  }
})

const { DATA_PROCESSING_ERROR } = require('../../app/constants/alerts')

beforeEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

const loadCreateAlerts = () => {
  const createAlerts = require('../../app/messaging/create-alerts').createAlerts
  const { EventPublisher } = require('ffc-pay-event-publisher')
  return { createAlerts, EventPublisher }
}

test('publishEvents called with normalized alerts', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [new Error('boom'), 'simple error', { code: 123 }]
  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance).toBeDefined()
  expect(publisherInstance.publishEvents).toBeDefined()
  expect(publisherInstance.publishEvents).toHaveBeenCalled()

  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(Array.isArray(published)).toBe(true)
  expect(published[0].data.message).toBe('boom')
  expect(published[1].data.message).toBe('simple error')
})

test('createAlerts defaults to DATA_PROCESSING_ERROR when type not provided', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{ msg: 'x' }]
  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance.publishEvents).toHaveBeenCalled()
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].type).toBe(DATA_PROCESSING_ERROR)
})

test('createAlerts uses provided type', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{ msg: 'y' }]
  await createAlerts(errors, 'CUSTOM_ERROR_TYPE')

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance.publishEvents).toHaveBeenCalled()
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].type).toBe('CUSTOM_ERROR_TYPE')
})

test('createAlerts handles empty errors array', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  await createAlerts([])

  // no instance should have been created
  expect(EventPublisher.mock.instances.length).toBe(0)
})

test('createAlerts handles no errors', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  await createAlerts()

  // no instance should have been created
  expect(EventPublisher.mock.instances.length).toBe(0)
})

test('createAlerts handles errors with no message', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [new Error(), { code: 404 }]
  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance.publishEvents).toHaveBeenCalled()
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].data.message).toBe('An error occurred')
  expect(published[1].data.message).toBe('An error occurred')
})

test('createAlerts handles errors with non-string message', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{ msg: 123 }, { msg: null }]
  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance.publishEvents).toHaveBeenCalled()
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].data.message).toBe('123')
  expect(published[1].data.message).toBe('An error occurred')
})

test('createAlerts handles errors with custom type', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{ msg: 'custom error' }]
  await createAlerts(errors, 'CUSTOM_TYPE')

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance.publishEvents).toHaveBeenCalled()
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].type).toBe('CUSTOM_TYPE')
})

test('createAlerts handles errors with custom source', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{ msg: 'source error' }]
  await createAlerts(errors, 'CUSTOM_TYPE')

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance.publishEvents).toHaveBeenCalled()
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].source).toBe('ffc-doc-statement-constructor')
})

test('createAlerts handles errors with custom data', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{ msg: 'data error', code: 500 }]
  await createAlerts(errors, 'CUSTOM_TYPE')

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance.publishEvents).toHaveBeenCalled()
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].data.code).toBe(500)
})

test('createAlerts handles errors with multiple properties', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{ msg: 'multi error', code: 400, details: 'Invalid input' }]
  await createAlerts(errors, 'CUSTOM_TYPE')

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance.publishEvents).toHaveBeenCalled()
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].data.code).toBe(400)
  expect(published[0].data.details).toBe('Invalid input')
})

test('createAlerts redacts top-level password and token fields', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{
    msg: 'sensitive error',
    password: 'super-secret-password',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  }]
  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance).toBeDefined()
  expect(publisherInstance.publishEvents).toHaveBeenCalled()
  const published = publisherInstance.publishEvents.mock.calls[0][0]

  expect(published[0].data.message).toBe('sensitive error')
  // verify redaction: exact token/password replaced with redaction marker
  expect(published[0].data.password).toBe('[REDACTED]')
  expect(published[0].data.token).toBe('[REDACTED]')
})

test('createAlerts handles object.message null -> DEFAULT_MESSAGE', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{ message: null }]
  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance).toBeDefined()
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].data.message).toBe('An error occurred')
})

test('createAlerts handles object.message blank -> DEFAULT_MESSAGE', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{ message: '    ' }]
  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance).toBeDefined()
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].data.message).toBe('An error occurred')
})

test('createAlerts handles numeric and boolean message values', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{ message: 0 }, { message: false }]
  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance).toBeDefined()
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].data.message).toBe('0')
  expect(published[1].data.message).toBe('false')
})

test('createAlerts rethrows when publishEvents fails', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()

  EventPublisher.mockImplementationOnce(function () {
    this.publishEvents = jest.fn().mockRejectedValue(new Error('publish failure'))
  })

  await expect(createAlerts([{ msg: 'will fail' }])).rejects.toThrow('publish failure')

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance).toBeDefined()
  expect(publisherInstance.publishEvents).toHaveBeenCalled()
})

test('createAlerts treats object.msg as non-primitive -> DEFAULT_MESSAGE', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [{ msg: { nested: 'x' } }]
  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  expect(publisherInstance).toBeDefined()
  const published = publisherInstance.publishEvents.mock.calls[0][0]

  expect(published[0].data.message).toBe('An error occurred')
})

test('sanitizeValue redacts long strings, array items and nested sensitive keys (case-insensitive api-key variants)', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()

  const veryLong = 'a'.repeat(300)
  const veryLong2 = 'b'.repeat(400)
  const errors = [{
    msg: 'arr',
    values: ['short', veryLong],
    longText: veryLong2,
    details: {
      password: 'p',
      'Api-Key': 'abc123',
      nested: {
        api_key: 'lowercase-match'
      }
    }
  }]

  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  const data = published[0].data

  expect(Array.isArray(data.values)).toBe(true)
  expect(data.values[0]).toBe('short')
  expect(data.values[1]).toBe('[REDACTED]')

  expect(data.longText).toBe('[REDACTED]')

  expect(data.details.password).toBe('[REDACTED]')
  expect(data.details['Api-Key']).toBe('[REDACTED]')
  expect(data.details.nested.api_key).toBe('[REDACTED]')
})

test('truncateStack truncates error stacks to five lines when building error data from error property', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()

  const err = new Error('stacked')
  err.stack = [
    'Error: stacked',
    ' at one',
    ' at two',
    ' at three',
    ' at four',
    ' at five',
    ' at six'
  ].join('\n')

  const errors = [{ error: err }]
  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  const errorStack = published[0].data.error.stack

  const lines = errorStack.split('\n').map(l => l.trim()).filter(Boolean)
  expect(lines.length).toBeLessThanOrEqual(5)
  expect(lines[0]).toContain('Error: stacked')
})

test('createAlerts handles primitive inputs (number and boolean) directly', async () => {
  const { createAlerts, EventPublisher } = loadCreateAlerts()
  const errors = [42, false]
  await createAlerts(errors)

  const publisherInstance = EventPublisher.mock.instances[0]
  const published = publisherInstance.publishEvents.mock.calls[0][0]
  expect(published[0].data.message).toBe('42')
  expect(published[1].data.message).toBe('false')
})
