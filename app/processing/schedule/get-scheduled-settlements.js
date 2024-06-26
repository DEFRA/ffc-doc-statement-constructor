const moment = require('moment')
const db = require('../../data')
const config = require('../../config').processingConfig

const getScheduledSettlements = async (started, documentType, transaction) => {
  return db.schedule.findAll({
    lock: true,
    skipLocked: true,
    limit: config.scheduleProcessingMaxBatchSize,
    transaction,
    include: [{
      model: db.settlement,
      as: 'settlements',
      attributes: []
    }],
    attributes: [
      'scheduleId',
      'settlementId'
    ],
    where: {
      category: documentType,
      completed: null,
      isActiveDocument: true,
      '$settlements.received$': {
        [db.Sequelize.Op.lte]: moment(started).subtract(config.settlementWaitTime).toDate()
      },
      [db.Sequelize.Op.or]: [{
        started: null
      }, {
        started: { [db.Sequelize.Op.lte]: moment(started).subtract(config.scheduleProcessingMaxElapsedTime).toDate() }
      }]
    },
    raw: true
  })
}

module.exports = getScheduledSettlements
