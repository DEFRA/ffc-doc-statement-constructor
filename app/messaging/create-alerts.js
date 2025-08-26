const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { DATA_PROCESSING_ERROR } = require('../constants/alerts')
const messageConfig = require('../config/message')
const santizedMaxLength = 200

const DEFAULT_MESSAGE = 'An error occurred'

const SENSITIVE_KEY_RE = /(password|pass|secret|token|key|credential|auth|api[_-]?key)/i
const REDACTED = '[REDACTED]'

const trimIfString = (value) => {
  if (typeof value === 'string') {
    return value.trim()
  }
  return value
}

const getMessageFromProp = (obj, propName) => {
  if (obj == null || typeof obj !== 'object') {
    return undefined
  }

  if (Object.hasOwn(obj, propName)) {
    const value = obj[propName]

    if (value === null || value === undefined) {
      return undefined
    }

    if (typeof value === 'string') {
      const string = value.trim()
      if (string.length > 0) {
        return string
      }
      return undefined
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value)
    }

    return undefined
  }

  return undefined
}

const normaliseErrorMessage = (err) => {
  if (!err || typeof err !== 'object') {
    return DEFAULT_MESSAGE
  }
  const message = trimIfString(err.message)
  if (message && message.length > 0) {
    return message
  }
  return DEFAULT_MESSAGE
}

const normaliseStringMessage = (str) => {
  if (typeof str !== 'string') {
    return DEFAULT_MESSAGE
  }
  const s = str.trim()
  if (s.length > 0) {
    return s
  }
  return DEFAULT_MESSAGE
}

const normaliseObjectMessage = (obj) => {
  const msgFromMsgProp = getMessageFromProp(obj, 'msg')
  if (msgFromMsgProp !== undefined) {
    return msgFromMsgProp
  }
  const msgFromMessageProp = getMessageFromProp(obj, 'message')
  if (msgFromMessageProp !== undefined) {
    return msgFromMessageProp
  }
  return DEFAULT_MESSAGE
}

const normaliseMessage = (error) => {
  if (error instanceof Error) {
    return normaliseErrorMessage(error)
  }
  if (error == null) {
    return DEFAULT_MESSAGE
  }

  const t = typeof error
  if (t === 'string') {
    return normaliseStringMessage(error)
  }
  if (t === 'number' || t === 'boolean') {
    return String(error)
  }
  if (t === 'object') {
    return normaliseObjectMessage(error)
  }

  return DEFAULT_MESSAGE
}

const sanitizeValue = (value, keyName) => {
  if (keyName && SENSITIVE_KEY_RE.test(keyName)) {
    return REDACTED
  }

  if (value == null) {
    return undefined
  }

  if (typeof value !== 'object') {
    if (typeof value === 'string' && value.length > santizedMaxLength) {
      return REDACTED
    }
    return value
  }

  if (Array.isArray(value)) {
    const arr = value
      .map((item) => sanitizeValue(item, keyName))
      .filter((item) => item !== undefined)
    if (arr.length === 0) {
      return undefined
    }
    return arr
  }

  const out = {}
  Object.keys(value).forEach((key) => {
    const sanitized = sanitizeValue(value[key], key)
    if (sanitized === undefined) {
      return
    }
    if (sanitized && typeof sanitized === 'object' && !Array.isArray(sanitized) && Object.keys(sanitized).length === 0) {
      return
    }
    out[key] = sanitized
  })

  if (Object.keys(out).length === 0) {
    return undefined
  }
  return out
}

const truncateStack = (stack, maxLines = 5) => {
  if (!stack) {
    return undefined
  }
  const lines = String(stack).split('\n').map((line) => line.trim()).filter(Boolean)
  if (!lines.length) {
    return undefined
  }
  return lines.slice(0, maxLines).join('\n')
}

const formatDataForEmail = (data) => {
  if (data == null || typeof data !== 'object') {
    return String(data)
  }

  const parts = Object.keys(data).map((key) => {
    const val = data[key]
    if (val == null) {
      return `${key}: ${val}`
    }
    const t = typeof val
    if (t === 'string') {
      return `${key}: ${val}`
    }
    if (t === 'number' || t === 'boolean') {
      return `${key}: ${String(val)}`
    }
    try {
      return `${key}: ${JSON.stringify(val)}`
    } catch (e) {
      return `${key}: ${String(val)}`
    }
  })

  return parts.join('\n')
}

const buildErrorData = (errorInstance) => {
  if (!errorInstance || typeof errorInstance !== 'object') {
    return {}
  }
  const errorData = {
    name: errorInstance.name,
    message: normaliseMessage(errorInstance),
    stack: truncateStack(errorInstance.stack)
  }
  const sanitized = sanitizeValue(errorData) || {}
  sanitized.text = formatDataForEmail(sanitized)
  return sanitized
}

const createAlertFromError = (errorInstance, type) => {
  const data = buildErrorData(errorInstance)
  return { source: SOURCE, type, data }
}

const createAlertFromObjectWithError = (input, type) => {
  const { error: errorInstance, ...context } = input || {}
  const sanitizedContext = sanitizeValue(context || {}) || {}
  sanitizedContext.error = buildErrorData(errorInstance)
  sanitizedContext.message = sanitizedContext.message || normaliseMessage(errorInstance)
  sanitizedContext.text = formatDataForEmail(sanitizedContext)
  return { source: SOURCE, type, data: sanitizedContext }
}

const createAlertFromObject = (input, type) => {
  const data = sanitizeValue(input) || {}

  const hasMessageProp = Object.hasOwn(data, 'message')
  const msgValue = hasMessageProp ? data.message : undefined

  const needsDefault =
    (!hasMessageProp) ||
    (msgValue === null) ||
    (msgValue === undefined) ||
    (typeof msgValue === 'string' && msgValue.trim().length === 0)

  if (needsDefault) {
    data.message = normaliseMessage(input)
  } else if (typeof msgValue === 'number' || typeof msgValue === 'boolean') {
    data.message = String(msgValue)
  } else if (typeof msgValue === 'string') {
    data.message = msgValue.trim()
  } else {
    data.message = String(msgValue)
  }

  data.text = formatDataForEmail(data)

  return { source: SOURCE, type, data }
}

const createAlertFromPrimitive = (input, type) => {
  const data = { message: normaliseMessage(input) }
  data.text = formatDataForEmail(data)
  return { source: SOURCE, type, data }
}

const createAlert = (input, type) => {
  if (input instanceof Error) {
    return createAlertFromError(input, type)
  }

  if (input && typeof input === 'object' && input.error instanceof Error) {
    return createAlertFromObjectWithError(input, type)
  }

  if (input && typeof input === 'object') {
    return createAlertFromObject(input, type)
  }

  return createAlertFromPrimitive(input, type)
}

const createAlerts = async (errors, type = DATA_PROCESSING_ERROR) => {
  if (!errors || !errors.length) {
    return
  }

  const alerts = errors
    .map((error) => createAlert(error, type))
    .filter(Boolean)

  if (!alerts || !alerts.length) {
    return
  }

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
