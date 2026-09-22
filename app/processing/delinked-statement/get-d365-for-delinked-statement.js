const { dataProcessingAlert } = require('ffc-alerting-utils')
const { d365 } = require('../../database')
const config = require('../../config').processingConfig
const { DATA_PROCESSING_ERROR } = require('../../../app/constants/alerts')

const getD365ForDelinkedStatement = async (transaction) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const d365ForDelinkedStatement = await d365(transaction)
      .select('d365Id', 'calculationId', 'paymentReference')
      .whereNull('startPublish')
      .where('transactionDate', '<', today)
      .orderBy('lastProcessAttempt', 'asc')
      .limit(config.maxProcessingBatchSize)
      .forUpdate()
      .skipLocked()

    return d365ForDelinkedStatement
  } catch (error) {
    const today = (() => {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      return d.toISOString()
    })()

    const queryContext = {
      where: {
        startPublish: null,
        transactionDateBefore: today
      },
      limit: config.maxProcessingBatchSize
    }

    const transactionId = transaction && (transaction.id || transaction.txId || transaction.name || null)
    const message = 'Error fetching D365 for delinked statement'
    console.error(message, { queryContext, transactionId, error })

    try {
      await dataProcessingAlert({
        process: 'getD365ForDelinkedStatement',
        transactionId,
        queryContext,
        message: `${message}: ${error.message}`
      }, DATA_PROCESSING_ERROR)
    } catch (alertError) {
      console.error(`${message} (alert failed)`, { originalError: error, alertError })
    }

    throw new Error(`${message}: ${error.message}`, { cause: error })
  }
}

module.exports = getD365ForDelinkedStatement
