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

const containsValueOrProperty = (obj, searchValue, propertyName = null) => {
  if (obj === undefined || obj === null) return false
  if (obj === searchValue) return true

  if (typeof obj !== 'object') {
    if (typeof searchValue === 'string' && typeof obj === 'string') {
      return obj.trim() === searchValue.trim()
    }
    return obj === searchValue || String(obj) === String(searchValue)
  }

  if (propertyName && obj[propertyName] !== undefined) {
    return containsValueOrProperty(obj[propertyName], searchValue)
  }

  if (Array.isArray(obj)) {
    return obj.some(val => containsValueOrProperty(val, searchValue))
  }

  return Object.values(obj).some(val => containsValueOrProperty(val, searchValue))
}

describe('createAlerts', () => {
  test('returns early for no input or empty array and returns undefined', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const r1 = await createAlerts()
    const r2 = await createAlerts([])

    expect(r1).toBeUndefined()
    expect(r2).toBeUndefined()

    expect(EventPublisher.mock.instances.length).toBe(0)
  })

  test('publishes alerts for mixed inputs with default type and returns undefined', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const inputs = [
      new Error('boom!'),
      '  trimmed  ',
      42,
      false,
      { msg: true }
    ]

    const result = await createAlerts(inputs)
    expect(result).toBeUndefined()

    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(inputs.length)
    expect(containsValueOrProperty(published[0].data, 'boom!')).toBe(true)
    expect(containsValueOrProperty(published[1].data, 'trimmed')).toBe(true)
    expect(
      containsValueOrProperty(published[2].data, '42') ||
      containsValueOrProperty(published[2].data, 42)
    ).toBe(true)
    expect(
      containsValueOrProperty(published[3].data, 'false') ||
      containsValueOrProperty(published[3].data, false)
    ).toBe(true)
    expect(
      containsValueOrProperty(published[4].data, true) ||
      containsValueOrProperty(published[4].data, 'true')
    ).toBe(true)
    expect(published.every(alert => alert.type === DATA_PROCESSING_ERROR)).toBe(true)
  })

  test('uses custom alert type and includes source and correct topic passed to EventPublisher', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()
    const messageConfig = require('../../app/config/message')

    const r = await createAlerts([{ msg: 'custom' }], 'CUSTOM_TYPE')
    expect(r).toBeUndefined()

    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published[0].type).toBe('CUSTOM_TYPE')
    expect(published[0].source).toBe('ffc-doc-statement-constructor')
    expect(EventPublisher.mock.calls.length).toBeGreaterThan(0)
    expect(EventPublisher.mock.calls[0][0]).toBe(messageConfig.alertTopic)
  })

  test('redacts sensitive keys and long strings (including regex variants)', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const input = [{
      password: 'secret',
      apiKey: 'key',
      'api-key': 'dashkey',
      api_key: 'underscore',
      AUTH: 'token',
      nested: { secret: 'hidden' },
      longText: 'a'.repeat(300)
    }]

    await createAlerts(input)

    const data = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0][0].data
    expect(data.password).toBe('[REDACTED]')
    expect(data.apiKey).toBe('[REDACTED]')
    expect(data['api-key']).toBe('[REDACTED]')
    expect(data.api_key).toBe('[REDACTED]')
    expect(data.AUTH).toBe('[REDACTED]')
    expect(data.nested.secret).toBe('[REDACTED]')
    expect(data.longText).toBe('[REDACTED]')
  })

  test('handles object circular references and array circular references gracefully', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const circularObj = {}
    circularObj.self = circularObj

    const circularArr = []
    circularArr.push(circularArr)

    await createAlerts([{ circularObj, circularArr }])

    const data = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0][0].data
    expect(containsValueOrProperty(data, '[Circular]')).toBe(true)
  })

  test('handles function values (fallback branch) by preserving them', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const fn = function myFunc () { return 'ok' }
    await createAlerts([{ keepFn: fn }])

    const data = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0][0].data
    expect(typeof data.keepFn).toBe('function')
    expect(data.keepFn()).toBe('ok')
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

  test('removes empty objects, arrays, and undefined values from nested structures', async () => {
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
    expect(data.emptyObj).toBeUndefined()
    expect(data.emptyArr).toBeUndefined()
    expect(data.nestedEmpty).toBeUndefined()
    expect(containsValueOrProperty(data, 'keep')).toBe(true)
    expect(containsValueOrProperty(data, 'yes')).toBe(true)

    if (data.values) {
      expect(data.values.includes(null)).toBe(false)
      expect(data.values.includes('')).toBe(false)
      expect(data.values.some(v => typeof v === 'object' && Object.keys(v).length === 0)).toBe(false)
    }
  })

  test('truncates stack traces to 5 lines for Error inputs', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const error = new Error('stack test')
    error.stack = Array(10).fill('line').join('\n')

    await createAlerts([error])

    const stack = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0][0].data.stack
    expect(stack.split('\n')).toHaveLength(5)
  })

  test('handles null and undefined inputs gracefully and publishes default messages', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const inputs = [null, undefined]
    await createAlerts(inputs)

    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(inputs.length)
    expect(containsValueOrProperty(published[0].data, 'An error occurred')).toBe(true)
    expect(containsValueOrProperty(published[1].data, 'An error occurred')).toBe(true)
  })

  test('handles empty string, falling back to default message', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    await createAlerts([''])
    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(1)
    expect(published[0].data.message).toBe('An error occurred')
  })

  test('handles empty msg property, falling back to default message', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    await createAlerts([{ msg: '' }])
    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(1)
    expect(published[0].data.message).toBe('An error occurred')
  })

  test('handles whitespace-only msg property, falling back to default message', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    await createAlerts([{ msg: '   ' }])
    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(1)
    expect(published[0].data.message).toBe('An error occurred')
  })

  test('handles objects without msg or message properties', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const input = [{ someOtherProperty: 'value', number: 123 }]
    await createAlerts(input)

    const data = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0][0].data
    expect(data.message).toBe('An error occurred')
    expect(data.someOtherProperty).toBe('value')
    expect(data.number).toBe(123)
  })

  test('handles Error with missing or empty stack trace', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const errorWithoutStack = new Error('no stack')
    delete errorWithoutStack.stack

    const errorWithEmptyStack = new Error('empty stack')
    errorWithEmptyStack.stack = ''

    const errorWithNullStack = new Error('null stack')
    errorWithNullStack.stack = null

    await createAlerts([errorWithoutStack, errorWithEmptyStack, errorWithNullStack])

    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(3)

    published.forEach(alert => {
      expect(alert.data.stack).toBe('')
    })
  })

  test('handles non-string inputs that bypass trimString string branch', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const inputs = [
      { msg: 42 },
      { msg: true },
      { message: false },
      { msg: null },
      { msg: undefined }
    ]

    await createAlerts(inputs)

    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(inputs.length)

    expect(published[0].data.message).toBe('42')
    expect(published[1].data.message).toBe('true')
    expect(published[2].data.message).toBe('false')
    expect(published[3].data.message).toBe('An error occurred')
    expect(published[4].data.message).toBe('An error occurred')
  })

  test('covers buildErrorData with non-object error input', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const errorWithoutName = new Error('test')
    delete errorWithoutName.name

    await createAlerts([errorWithoutName])

    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(1)
    expect(published[0].data.message).toBe('test')

    expect(published[0].data.name).toBe('Error')
  })

  test('covers trimString with Error message edge cases', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const errorWithEmptyMessage = new Error('')
    const errorWithWhitespaceMessage = new Error('   ')

    await createAlerts([errorWithEmptyMessage, errorWithWhitespaceMessage])

    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(2)

    expect(published[0].data.message).toBe('An error occurred')
    expect(published[1].data.message).toBe('An error occurred')
  })

  test('covers lines.length check in truncateStack', async () => {
    const { createAlerts, EventPublisher } = loadCreateAlerts()

    const errorWithEmptyLines = new Error('test')
    errorWithEmptyLines.stack = 'line1\n\n   \nline2\n\n'

    await createAlerts([errorWithEmptyLines])

    const published = EventPublisher.mock.instances[0].publishEvents.mock.calls[0][0]
    expect(published).toHaveLength(1)

    const stack = published[0].data.stack
    expect(stack).toBe('line1\nline2')
  })
})
