const { createAlerts } = require('../messaging/create-alerts')
const { DATA_PROCESSING_ERROR } = require('../constants/alerts')

const validatePayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new TypeError('payload must be an object with at least a `process` property')
  }
  const processName = payload.process
  if (!processName || typeof processName !== 'string') {
    throw new TypeError('payload.process (string) is required')
  }
  return processName
}

const deriveAlertData = (payload, processName) => {
  const alertData = { ...payload, process: processName }

  const needsMessage =
    (!Object.hasOwn(alertData, 'message')) ||
    (alertData.message == null) ||
    (typeof alertData.message === 'string' && alertData.message.trim().length === 0)

  if (needsMessage) {
    const maybeError = alertData.error

    if (maybeError instanceof Error) {
      alertData.message = maybeError.message || `Failed processing ${processName}`
    } else if (typeof maybeError === 'object' && maybeError != null && typeof maybeError.message === 'string') {
      alertData.message = maybeError.message
    } else if (typeof maybeError === 'string') {
      alertData.message = maybeError
      alertData.error = null
    } else {
      alertData.message = `Failed processing ${processName}`
    }
  }

  return alertData
}

const publish = async (alertPayloadArray, type, throwOnPublishError) => {
  try {
    await createAlerts(alertPayloadArray, type)
  } catch (err) {
    console.error(`Failed to publish processing alert for ${alertPayloadArray?.[0]?.process ?? 'unknown'}`, err)
    if (throwOnPublishError) {
      throw err
    }
  }
}

const dataProcessingAlert = async (payload = {}, type = DATA_PROCESSING_ERROR, options = {}) => {
  const processName = validatePayload(payload)
  const { throwOnPublishError = false } = options
  const alertData = deriveAlertData(payload, processName)
  await publish([alertData], type, throwOnPublishError)
}

module.exports = {
  dataProcessingAlert
}
