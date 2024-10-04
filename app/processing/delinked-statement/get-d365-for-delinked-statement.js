const db = require('../../data')
const config = require('../../config').processingConfig

const getD365ForDelinkedStatement = async (transaction) => {
  return db.d365.findAll({
    lock: true,
    skipLocked: true,
    order: [
      ['lastProcessAttempt', 'ASC']
    ],
    limit: config.scheduleProcessingMaxBatchSize,
    transaction,
    attributes: [
      'd365Id',
      'calculationId',
      'paymentReference'
    ],
    where: {
      startPublish: null
    },
    raw: true
  })
}

module.exports = getD365ForDelinkedStatement
