const { Sequelize } = require('../data')
const { dataProcessingAlert } = require('../utility/processing-alerts')
const { DATA_PROCESSING_ERROR } = require('../../app/constants/alerts')
const isTestEnv = process.env.NODE_ENV === 'test' || typeof process.env.JEST_WORKER_ID !== 'undefined'
const MAX_RETRIES = Number(process.env.RETRY_FK_MAX_RETRIES) || (isTestEnv ? 3 : 8)
const BASE_DELAY_MS = Number(process.env.RETRY_FK_BASE_DELAY_MS) || (isTestEnv ? 10 : 5000) // test: 10ms; prod: 5s
const MAX_TOTAL_DELAY_MS = Number(process.env.RETRY_FK_MAX_TOTAL_DELAY_MS) || (isTestEnv ? 1000 : 240000) // test: 1s; prod: 4m

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

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
      const alertData = {
        process: 'retryOnFkError',
        context,
        identifier,
        error,
        data: {
          attempt,
          totalDelay
        }
      }

      if (error instanceof Sequelize.ForeignKeyConstraintError) {
        attempt++
        if (attempt < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1)
          if (totalDelay + delay > MAX_TOTAL_DELAY_MS) {
            try {
              await dataProcessingAlert({
                ...alertData,
                message: `FK error would exceed max total retry time (${MAX_TOTAL_DELAY_MS}ms), giving up.`
              }, DATA_PROCESSING_ERROR)
            } catch (alertErr) {
              console.error(`Failed to send dataProcessingAlert for FK error exceed max total delay for ${context} ${identifier}.`,
                { originalError: error, alertError: alertErr, attempt, totalDelay }
              )
            }

            const thrown = new Error(`FK error for ${context} ${identifier} would exceed max total retry time (${MAX_TOTAL_DELAY_MS}ms), giving up.`)
            try { thrown.cause = error } catch (_) {}
            thrown.data = { context, identifier, attempt, totalDelay }
            throw thrown
          }

          console.warn(`FK error for ${context} ${identifier}, retrying in ${delay}ms (attempt ${attempt}/${MAX_RETRIES})`)
          await sleep(delay)
          totalDelay += delay
          continue
        } else {
          try {
            await dataProcessingAlert({
              ...alertData,
              message: `FK error after ${MAX_RETRIES} attempts, giving up.`
            }, DATA_PROCESSING_ERROR)
          } catch (alertErr) {
            console.error(`Failed to send dataProcessingAlert for FK error after max attempts for ${context} ${identifier}.`,
              { originalError: error, alertError: alertErr, attempt, totalDelay }
            )
          }

          const thrown = new Error(`FK error for ${context} ${identifier} after ${MAX_RETRIES} attempts, giving up.`)
          try { thrown.cause = error } catch (_) {}
          thrown.data = { context, identifier, attempt, totalDelay }
          throw thrown
        }
      } else {
        try {
          await dataProcessingAlert({
            ...alertData,
            message: 'Non-FK error thrown, aborting retries.'
          }, DATA_PROCESSING_ERROR)
        } catch (alertErr) {
          console.error(`Failed to send dataProcessingAlert for non-FK error for ${context} ${identifier}.`,
            { originalError: error, alertError: alertErr, attempt, totalDelay }
          )
        }
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
