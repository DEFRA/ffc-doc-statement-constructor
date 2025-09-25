const db = require('../../data')
const config = require('../../config').processingConfig
const { dataProcessingAlert } = require('ffc-alerting-utils')
const { DATA_PROCESSING_ERROR } = require('../../../app/constants/alerts')

const getD365ForDelinkedStatement = async (transaction) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const d365ForDelinkedStatement = await db.d365.findAll({
      lock: true,
      skipLocked: true,
      order: [
        ['lastProcessAttempt', 'ASC']
      ],
      limit: config.maxProcessingBatchSize,
      transaction,
      attributes: [
        'd365Id',
        'calculationId',
        'paymentReference'
      ],
      where: {
        startPublish: null,
        transactionDate: { [db.Sequelize.Op.lt]: today }
      },
      raw: true
    })

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
