const { Sequelize } = require('../data')

const MAX_RETRIES = 5
const BASE_DELAY_MS = 1000

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Retry a function on ForeignKeyConstraintError with exponential backoff
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
          const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1)
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
  sleep
}
