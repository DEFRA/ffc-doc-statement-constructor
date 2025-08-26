const { createAlerts } = require('../messaging/create-alerts')
const { DATA_PROCESSING_ERROR } = require('../constants/alerts')

/**
 * publishProcessingAlert - helper to publish a standard processing alert
 *
 * Inputs:
 *  - payload: {
 *      process: string (required) - name/id of the process e.g. 'process-d365'
 *      message?: string
 *      error?: Error | string | object
 *      ...any other keys to include (e.g. paymentReference, sbi, calculationId)
 *    }
 *  - type: optional alert type (defaults to DATA_PROCESSING_ERROR)
 *  - options: { throwOnPublishError: boolean } - default false
 */
const dataProcessingAlert = async (payload = {}, type = DATA_PROCESSING_ERROR, options = {}) => {
  if (!payload || typeof payload !== 'object') {
    throw new TypeError('payload must be an object with at least a `process` property')
  }

  const { process: processName } = payload
  if (!processName || typeof processName !== 'string') {
    throw new TypeError('payload.process (string) is required')
  }

  const { throwOnPublishError = false } = options
  const alertData = Object.assign({}, payload)

  if (!Object.hasOwn(alertData, 'message') || alertData.message == null || (typeof alertData.message === 'string' && alertData.message.trim().length === 0)) {
    const maybeError = alertData.error
    if (maybeError instanceof Error) {
      alertData.message = maybeError.message || `Failed processing ${processName}`
    } else if (typeof maybeError === 'object' && maybeError != null && typeof maybeError.message === 'string') {
      alertData.message = maybeError.message
    } else if (typeof maybeError === 'string') {
      alertData.message = maybeError
      alertData.error = undefined
    } else {
      alertData.message = `Failed processing ${processName}`
    }
  }
  alertData.process = processName

  try {
    await createAlerts([alertData], type)
  } catch (err) {
    console.error(`Failed to publish processing alert for ${processName}`, err)
    if (throwOnPublishError) throw err
  }
}

module.exports = {
  dataProcessingAlert
}
