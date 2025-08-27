const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { DATA_PROCESSING_ERROR } = require('../constants/alerts')
const messageConfig = require('../config/message')

const DEFAULT_MESSAGE = 'An error occurred'
const SENSITIVE_KEY_PATTERN = /(password|pass|secret|token|key|credential|auth|api[_-]?key)/i
const REDACTED = '[REDACTED]'
const MAX_SANITIZED_LENGTH = 200

const trimString = (value) => (typeof value === 'string' ? value.trim() : value)

const getPropertyMessage = (object, propertyName) => {
  if (!object || typeof object !== 'object') return undefined
  const propertyValue = object[propertyName]
  if (propertyValue == null) return undefined
  if (typeof propertyValue === 'string') return trimString(propertyValue) || undefined
  if (['number', 'boolean'].includes(typeof propertyValue)) return String(propertyValue)
  return undefined
}

const normalizeMessage = (input) => {
  if (input instanceof Error) return trimString(input.message) || DEFAULT_MESSAGE
  if (input == null) return DEFAULT_MESSAGE
  if (typeof input === 'string') return trimString(input) || DEFAULT_MESSAGE
  if (['number', 'boolean'].includes(typeof input)) return String(input)
  if (typeof input === 'object') {
    return getPropertyMessage(input, 'msg') || getPropertyMessage(input, 'message') || DEFAULT_MESSAGE
  }
  return DEFAULT_MESSAGE
}

const sanitizeValue = (value, key, seen = new WeakSet()) => {
  if (key && SENSITIVE_KEY_PATTERN.test(key)) return REDACTED
  // Handle circular detection at the top level
  if (typeof value === 'object' && value !== null && seen.has(value)) return '[Circular]'
  // Return undefined for null values so they get filtered out
  if (value == null) return undefined
  if (typeof value === 'string' && value.length > MAX_SANITIZED_LENGTH) return REDACTED
  if (['number', 'boolean'].includes(typeof value)) return value
  if (Array.isArray(value)) return sanitizeArray(value, key, seen)
  if (typeof value === 'object') return sanitizeObject(value, seen)
  return value
}

const sanitizeObject = (object, seen) => {
  if (seen.has(object)) return '[Circular]'
  seen.add(object)
  const sanitizedObject = {}
  Object.entries(object).forEach(([key, value]) => {
    const sanitized = sanitizeValue(value, key, seen)
    if (sanitized !== undefined) sanitizedObject[key] = sanitized
  })
  return Object.keys(sanitizedObject).length ? sanitizedObject : undefined
}

const sanitizeArray = (array, key, seen) => {
  if (seen.has(array)) return '[Circular]'
  seen.add(array)
  const sanitizedArray = array
    .map((item) => sanitizeValue(item, key, seen))
    .filter((item) => {
      // Filter out undefined, null, and empty strings
      if (item === undefined || item === null) return false
      if (typeof item === 'string' && item.trim() === '') return false
      return true
    })
  return sanitizedArray.length ? sanitizedArray : undefined
}

const truncateStack = (stack, maxLines = 5) => {
  if (!stack) return ''
  const lines = String(stack).split('\n').map((line) => line.trim()).filter(Boolean)
  return lines.length ? lines.slice(0, maxLines).join('\n') : ''
}

const buildErrorData = (error) => {
  if (!error || typeof error !== 'object') return {}
  // Create error data with normalized message
  return {
    name: error.name,
    message: normalizeMessage(error),
    stack: truncateStack(error.stack)
  }
}

const createAlert = (input, alertType) => {
  let data

  if (input instanceof Error) {
    data = buildErrorData(input)
  } else {
    // First normalize the message (this handles all input types)
    const message = normalizeMessage(input)

    // Create data object from sanitized input
    data = sanitizeValue(input) || {}

    // IMPORTANT: Always set the message property regardless of sanitization
    data.message = message
  }

  return { source: SOURCE, type: alertType, data }
}

const createAlerts = async (errors, alertType = DATA_PROCESSING_ERROR) => {
  if (!errors?.length) return
  const alerts = errors.map((error) => createAlert(error, alertType)).filter(Boolean)
  if (!alerts.length) return

  const eventPublisher = new EventPublisher(messageConfig.alertTopic)
  try {
    await eventPublisher.publishEvents(alerts)
  } catch (error) {
    console.error('Failed to publish alerts', error)
    throw error
  }
}

module.exports = { createAlerts }
