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
  const message = trimIfString(err.message)
  return message && message.length > 0 ? message : DEFAULT_MESSAGE
}

const normaliseStringMessage = (str) => {
  const s = str.trim()
  return s.length > 0 ? s : DEFAULT_MESSAGE
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
  if (error instanceof Error) return normaliseErrorMessage(error)
  if (error == null) return DEFAULT_MESSAGE

  const t = typeof error
  if (t === 'string') return normaliseStringMessage(error)
  if (t === 'number' || t === 'boolean') return String(error)
  if (t === 'object') return normaliseObjectMessage(error)

  return DEFAULT_MESSAGE
}

const sanitizeValue = (value, keyName) => {
  if (keyName && SENSITIVE_KEY_RE.test(keyName)) {
    return REDACTED
  }

  if (value == null) {
    return value
  }

  if (typeof value !== 'object') {
    if (typeof value === 'string' && value.length > santizedMaxLength) {
      return REDACTED
    }
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, keyName))
  }

  const out = {}
  Object.keys(value).forEach((key) => {
    out[key] = sanitizeValue(value[key], key)
  })
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

const buildErrorData = (errorInstance) => {
  const errorData = {
    name: errorInstance.name,
    message: normaliseMessage(errorInstance),
    stack: truncateStack(errorInstance.stack)
  }
  return sanitizeValue(errorData)
}

const createAlertFromError = (errorInstance, type) => {
  return { source: SOURCE, type, data: buildErrorData(errorInstance) }
}

const createAlertFromObjectWithError = (input, type) => {
  const { error: errorInstance, ...context } = input || {}
  const sanitizedContext = sanitizeValue(context || {})
  sanitizedContext.error = buildErrorData(errorInstance)
  sanitizedContext.message = sanitizedContext.message || normaliseMessage(errorInstance)
  return { source: SOURCE, type, data: sanitizedContext }
}

const createAlertFromObject = (input, type) => {
  const data = sanitizeValue(input)

  const hasMessageProp = Object.hasOwn(data, 'message')
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
  } else if (typeof msgValue === 'string') {
    data.message = msgValue.trim()
  } else {
    data.message = String(msgValue)
  }

  return { source: SOURCE, type, data }
}

const createAlertFromPrimitive = (input, type) => {
  return { source: SOURCE, type, data: { message: normaliseMessage(input) } }
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
  if (!errors?.length) {
    return
  }

  const alerts = errors
    .map((error) => createAlert(error, type))
    .filter(Boolean)

  if (!alerts.length) {
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
