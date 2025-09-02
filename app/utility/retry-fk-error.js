const { Sequelize } = require('../data')
const DEFAULT_MAX_RETRIES = 8
const DEFAULT_BASE_DELAY_MS = 5000 // 5s
const DEFAULT_MAX_TOTAL_DELAY_MS = 240000 // 4m

const parseEnvInt = (name) => {
  const v = process.env[name]
  if (typeof v === 'undefined' || v === '') {
    return undefined
  }
  const n = Number(v)
  return Number.isNaN(n) ? undefined : n
}

const MAX_RETRIES = parseEnvInt('RETRY_FK_MAX_RETRIES') ?? DEFAULT_MAX_RETRIES
const BASE_DELAY_MS = parseEnvInt('RETRY_FK_BASE_DELAY_MS') ?? DEFAULT_BASE_DELAY_MS
const MAX_TOTAL_DELAY_MS = parseEnvInt('RETRY_FK_MAX_TOTAL_DELAY_MS') ?? DEFAULT_MAX_TOTAL_DELAY_MS
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const createWrappedError = (message, cause, data) => {
  const thrown = new Error(message)

  if (cause !== undefined) {
    try {
      thrown.cause = cause
    } catch (err) {
      console.warn('Could not set error.cause property; attaching as .originalError', err)
      thrown.originalError = cause
    }
  }

  if (data !== undefined) {
    thrown.data = { data }
  }

  return thrown
}

/**
 * Retry a function on ForeignKeyConstraintError with exponential backoff (capped at MAX_TOTAL_DELAY_MS total delay)
 * @param {Function} fn - The function to retry
 * @param {string} context - Context for logging (e.g., 'D365', 'calculation')
 * @param {string} identifier - Identifier for logging (e.g., paymentReference, calculationReference)
 * @returns {Promise} - Result of the function
 */
const retryOnFkError = async (fn, context, identifier) => {
  let attempt = 0
  let totalDelay = 0

  while (attempt < MAX_RETRIES) {
    try {
      return await fn()
    } catch (error) {
      if (!(error instanceof Sequelize.ForeignKeyConstraintError)) {
        throw error
      } else {
        console.warn(`Caught FK error on attempt ${attempt + 1} for ${context} ${identifier}:`, error)
      }

      attempt += 1

      if (attempt >= MAX_RETRIES) {
        throw createWrappedError(`FK error for ${context} ${identifier} after ${MAX_RETRIES} attempts, giving up.`, error, { context, identifier, attempt, totalDelay })
      }

      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1)

      if (totalDelay + delay > MAX_TOTAL_DELAY_MS) {
        throw createWrappedError(`FK error for ${context} ${identifier} would exceed max total retry time (${MAX_TOTAL_DELAY_MS}ms), giving up.`, error, { context, identifier, attempt, totalDelay })
      }

      console.warn(`FK error for ${context} ${identifier}, retrying in ${delay}ms (attempt ${attempt}/${MAX_RETRIES})`)
      await sleep(delay)
      totalDelay += delay
    }
  }
}

module.exports = {
  retryOnFkError,
  createWrappedError,
  parseEnvInt,
  sleep
}
