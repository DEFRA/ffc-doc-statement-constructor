const db = require('../../data')
const config = require('../../config').processingConfig

const getDaxsForSfi23QuarterlyStatement = async (transaction) => {
  return db.dax.findAll({
    lock: true,
    skipLocked: true,
    order: [
      ['lastProcessAttempt', 'ASC']
    ],
    limit: config.maxProcessingBatchSize,
    transaction,
    attributes: [
      'daxId',
      'calculationId',
      'paymentReference',
      'paymentPeriod',
      'paymentAmount',
      'transactionDate'
    ],
    where: {
      startPublish: null
    },
    raw: true
  })
}

module.exports = getDaxsForSfi23QuarterlyStatement
