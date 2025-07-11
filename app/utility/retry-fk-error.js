const { Sequelize } = require('../data')

const MAX_RETRIES = 8
const BASE_DELAY_MS = 5000 // 5 seconds
const MAX_DELAY_MS = 300000 // 5 minutes

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Retry a function on ForeignKeyConstraintError with exponential backoff (capped at 5 minutes)
 * @param {Function} fn - The function to retry
 * @param {string} context - Context for logging (e.g., 'D365', 'calculation')
 * @param {string} identifier - Identifier for logging (e.g., paymentReference, calculationReference)
 * @returns {Promise} - Result of the function
 */
const retryOnFkError = async (fn, context, identifier) => {
  let attempt = 0
  while (attempt < MAX_RETRIES) {
    try {
      return await fn()
    } catch (error) {
      if (error instanceof Sequelize.ForeignKeyConstraintError) {
        attempt++
        if (attempt < MAX_RETRIES) {
          const delay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt - 1), MAX_DELAY_MS)
          console.warn(`FK error for ${context} ${identifier}, retrying in ${delay}ms (attempt ${attempt}/${MAX_RETRIES})`)
          await module.exports.sleep(delay)
          continue
        } else {
          console.error(`FK error for ${context} ${identifier} after ${MAX_RETRIES} attempts, giving up.`)
          throw error
        }
      } else {
        throw error
      }
    }
  }
}

module.exports = {
  retryOnFkError,
  MAX_RETRIES,
  BASE_DELAY_MS,
  MAX_DELAY_MS,
  sleep
}
