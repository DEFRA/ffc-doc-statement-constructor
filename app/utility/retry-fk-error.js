const { Sequelize } = require('../data')

const MAX_RETRIES = 8
const BASE_DELAY_MS = 5000 // 5 seconds
const MAX_TOTAL_DELAY_MS = 240000 // 4 minutes

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Retry a function on ForeignKeyConstraintError with exponential backoff (capped at 4 minutes total delay)
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
      if (error instanceof Sequelize.ForeignKeyConstraintError) {
        attempt++
        if (attempt < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1)
          if (totalDelay + delay > MAX_TOTAL_DELAY_MS) {
            console.error(`FK error for ${context} ${identifier} would exceed max total retry time (${MAX_TOTAL_DELAY_MS}ms), giving up.`)
            throw error
          }
          console.warn(`FK error for ${context} ${identifier}, retrying in ${delay}ms (attempt ${attempt}/${MAX_RETRIES})`)
          await module.exports.sleep(delay)
          totalDelay += delay
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
