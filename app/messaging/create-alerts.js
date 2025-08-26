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

const normaliseMessage = (error) => {
  if (error instanceof Error) {
    const message = trimIfString(error.message)
    if (message && message.length > 0) {
      return message
    }
    return DEFAULT_MESSAGE
  }

  if (error == null) {
    return DEFAULT_MESSAGE
  }

  if (typeof error === 'string') {
    const string = error.trim()
    if (string.length > 0) {
      return string
    }
    return DEFAULT_MESSAGE
  }

  if (typeof error === 'number' || typeof error === 'boolean') {
    return String(error)
  }

  if (typeof error === 'object') {
    const msgFromMsgProp = getMessageFromProp(error, 'msg')
    if (msgFromMsgProp !== undefined) {
      return msgFromMsgProp
    }

    const msgFromMessageProp = getMessageFromProp(error, 'message')
    if (msgFromMessageProp !== undefined) {
      return msgFromMessageProp
    }
  }

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

const createAlert = (input, type) => {
  let data = {}

  if (input instanceof Error) {
    data = buildErrorData(input)
    return { source: SOURCE, type, data }
  }

  if (input && typeof input === 'object' && input.error instanceof Error) {
    const context = { ...input }
    const errorInstance = context.error
    delete context.error

    const sanitizedContext = sanitizeValue(context || {})
    sanitizedContext.error = buildErrorData(errorInstance)

    sanitizedContext.message = sanitizedContext.message || normaliseMessage(errorInstance)

    return { source: SOURCE, type, data: sanitizedContext }
  }

  if (input && typeof input === 'object') {
    data = sanitizeValue(input)

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
    }

    return { source: SOURCE, type, data }
  }

  data.message = normaliseMessage(input)
  return { source: SOURCE, type, data }
}

const createAlerts = async (errors, type = DATA_PROCESSING_ERROR) => {
  if (!errors || !errors.length) {
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
