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

// Helper function to search for values in nested objects
const containsValueOrProperty = (obj, searchValue, propertyName = null) => {
  if (!obj) return false
  if (obj === searchValue) return true

  if (typeof obj !== 'object') {
    // Check string equivalence for primitives
    if (typeof searchValue === 'string' && typeof obj === 'string') {
      return obj.trim() === searchValue.trim()
    }
    return obj === searchValue || String(obj) === String(searchValue)
  }

  // Check specific property if requested
  if (propertyName && obj[propertyName] !== undefined) {
    return containsValueOrProperty(obj[propertyName], searchValue)
  }

  // Search through object properties
  return Object.values(obj).some(val => containsValueOrProperty(val, searchValue))
}

describe('createAlerts', () => {
  test('returns early for no input or empty array', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    await createAlerts()
    await createAlerts([])

    expect(EventPublisher.mock.instances.length).toBe(0)
  })

  test('publishes alerts for mixed inputs with default type', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const inputs = [
      new Error('boom!'),
      '  trimmed  ',
      42,
      false,
      { msg: true }
    ]

    await createAlerts(inputs)

    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(inputs.length)

    // Check that Error's message is preserved
    expect(containsValueOrProperty(published[0].data, 'boom!')).toBe(true)

    // Check that string is trimmed somewhere in the data
    expect(containsValueOrProperty(published[1].data, 'trimmed')).toBe(true)

    // Check that number is converted to string somewhere in the data
    expect(containsValueOrProperty(published[2].data, '42') ||
           containsValueOrProperty(published[2].data, 42)).toBe(true)

    // Check that boolean is converted to string somewhere in the data
    expect(containsValueOrProperty(published[3].data, 'false') ||
           containsValueOrProperty(published[3].data, false)).toBe(true)

    // Check that object property is preserved somewhere
    expect(containsValueOrProperty(published[4].data, true) ||
           containsValueOrProperty(published[4].data, 'true')).toBe(true)

    // Check all alerts have correct type
    expect(published.every(alert => alert.type === DATA_PROCESSING_ERROR)).toBe(true)
  })

  test('uses custom alert type and includes source', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    await createAlerts([{ msg: 'custom' }], 'CUSTOM_TYPE')

    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published[0].type).toBe('CUSTOM_TYPE')
    expect(published[0].source).toBe('ffc-doc-statement-constructor')
  })

  test('redacts sensitive keys and long strings', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const input = [{
      password: 'secret',
      apiKey: 'key',
      nested: { secret: 'hidden' },
      longText: 'a'.repeat(300)
    }]

    await createAlerts(input)

    const data = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0][0].data
    expect(data.password).toBe('[REDACTED]')
    expect(data.apiKey).toBe('[REDACTED]')
    expect(data.nested.secret).toBe('[REDACTED]')
    expect(data.longText).toBe('[REDACTED]')
  })

  test('handles circular references gracefully', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const circular = {}
    circular.self = circular

    await createAlerts([{ circular }])

    const data = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0][0].data

    // Check if circular reference is handled by searching for "[Circular]" string
    expect(
      containsValueOrProperty(data, '[Circular]')
    ).toBe(true)
  })

  test('logs and rethrows errors when publishing fails', async () => {
    const { EventPublisher } = loadCreateAlerts()
    EventPublisher.mockImplementationOnce(function () {
      this.publishEvents = jest.fn().mockRejectedValue(new Error('publish failed'))
    })

    const { createAlerts } = loadCreateAlerts()
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await expect(createAlerts([{ msg: 'fail' }])).rejects.toThrow('publish failed')

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to publish alerts', expect.any(Error))
    consoleErrorSpy.mockRestore()
  })

  test('removes empty objects, arrays, and undefined values', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const input = [{
      emptyObj: {},
      emptyArr: [],
      nestedEmpty: { child: {} },
      values: [null, {}, '', 'keep'],
      keep: { present: 'yes' }
    }]

    await createAlerts(input)

    const data = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0][0].data

    // Check expected properties are undefined/removed
    expect(data.emptyObj).toBeUndefined()
    expect(data.emptyArr).toBeUndefined()
    expect(data.nestedEmpty).toBeUndefined()

    // Verify only non-empty values are kept
    expect(containsValueOrProperty(data, 'keep')).toBe(true)
    expect(containsValueOrProperty(data, 'yes')).toBe(true)

    // Check that empty values are filtered out
    if (data.values) {
      expect(data.values.includes(null)).toBe(false)
      expect(data.values.includes('')).toBe(false)
      expect(data.values.some(v => typeof v === 'object' && Object.keys(v).length === 0)).toBe(false)
    }
  })

  test('truncates stack traces to 5 lines', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const error = new Error('stack test')
    error.stack = Array(10).fill('line').join('\n')

    await createAlerts([error])

    const stack = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0][0].data.stack
    expect(stack.split('\n')).toHaveLength(5)
  })

  test('handles null and undefined inputs gracefully', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const inputs = [null, undefined]
    await createAlerts(inputs)

    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(inputs.length)

    // Check both alerts have the default message
    expect(containsValueOrProperty(published[0].data, 'An error occurred')).toBe(true)
    expect(containsValueOrProperty(published[1].data, 'An error occurred')).toBe(true)
  })
})
