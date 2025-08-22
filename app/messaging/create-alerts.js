const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { DATA_PROCESSING_ERROR } = require('../constants/alerts')
const messageConfig = require('../config/message')

const DEFAULT_MESSAGE = 'An error occurred'

// redaction config: keys that should be redacted
const SENSITIVE_KEY_RE = /(password|pass|secret|token|key|credential|auth|api[_-]?key)/i
const REDACTED = '[REDACTED]'

const normaliseMessage = (error) => {
  if (error instanceof Error) {
    const msg = error.message && String(error.message).trim()
    return msg || DEFAULT_MESSAGE
  }

  if (error == null) return DEFAULT_MESSAGE

  if (typeof error === 'string') {
    const string = error.trim()
    return string.length ? string : DEFAULT_MESSAGE
  }

  if (typeof error === 'number' || typeof error === 'boolean') {
    return String(error)
  }

  if (typeof error === 'object') {
    if (Object.prototype.hasOwnProperty.call(error, 'msg')) {
      const message = error.msg
      if (message === null || message === undefined) return DEFAULT_MESSAGE
      if (typeof message === 'string') {
        const string = message.trim()
        return string.length ? string : DEFAULT_MESSAGE
      }
      if (typeof message === 'number' || typeof message === 'boolean') return String(message)
      return DEFAULT_MESSAGE
    }

    if (Object.prototype.hasOwnProperty.call(error, 'message')) {
      const message = error.message
      if (message === null || message === undefined) return DEFAULT_MESSAGE
      if (typeof message === 'string') {
        const string = message.trim()
        return string.length ? string : DEFAULT_MESSAGE
      }
      if (typeof message === 'number' || typeof message === 'boolean') return String(message)
      return DEFAULT_MESSAGE
    }
  }

  return DEFAULT_MESSAGE
}

const sanitizeValue = (value, keyName) => {
  if (keyName && SENSITIVE_KEY_RE.test(keyName)) {
    return REDACTED
  }

  if (value == null) return value

  if (typeof value !== 'object') {
    if (typeof value === 'string' && value.length > 200) {
      return REDACTED
    }
    return value
  }

  if (Array.isArray(value)) {
    return value.map((v) => sanitizeValue(v, keyName))
  }

  const out = {}
  Object.keys(value).forEach(k => {
    out[k] = sanitizeValue(value[k], k)
  })
  return out
}

const truncateStack = (stack, maxLines = 5) => {
  if (!stack) return undefined
  const lines = String(stack).split('\n').map(l => l.trim()).filter(Boolean)
  if (!lines.length) return undefined
  return lines.slice(0, maxLines).join('\n')
}

const createAlert = (input, type) => {
  let data = {}

  if (input instanceof Error) {
    data = sanitizeValue({
      name: input.name,
      message: normaliseMessage(input),
      stack: truncateStack(input.stack)
    })
    return { source: SOURCE, type, data }
  }

  if (input && typeof input === 'object' && input.error instanceof Error) {
    const ctx = { ...input }
    const errInstance = ctx.error
    delete ctx.error

    data = sanitizeValue(ctx || {})

    data.error = sanitizeValue({
      name: errInstance.name,
      message: normaliseMessage(errInstance),
      stack: truncateStack(errInstance.stack)
    })

    data.message = data.message || normaliseMessage(errInstance)

    return { source: SOURCE, type, data }
  }

  if (input && typeof input === 'object') {
    data = sanitizeValue(input)

    const hasMessageProp = Object.prototype.hasOwnProperty.call(data, 'message')
    const msgValue = hasMessageProp ? data.message : undefined

    const needsDefault =
      !hasMessageProp ||
      msgValue === null ||
      msgValue === undefined ||
      (typeof msgValue === 'string' && msgValue.trim().length === 0)

    if (needsDefault) {
      data.message = normaliseMessage(input)
    } else if (typeof msgValue === 'number' || typeof msgValue === 'boolean') {
      data.message = String(msgValue)
    }
    return { source: SOURCE, type, data }
  }

  data.message = normaliseMessage(input)
  return { source: SOURCE, type, data }
}

const createAlerts = async (errors, type = DATA_PROCESSING_ERROR) => {
  if (!errors || !errors.length) return

  const alerts = errors
    .map(error => createAlert(error, type))
    .filter(Boolean)

  if (!alerts.length) return

  const eventPublisher = new EventPublisher(messageConfig.alertTopic)
  try {
    await eventPublisher.publishEvents(alerts)
  } catch (err) {
    console.error('Failed to publish alerts', err)
    throw err
  }
}

module.exports = {
  createAlerts
}
