const moment = require('moment')
const db = require('../../data')
const config = require('../../config').processingConfig
const { SCHEDULE } = require('../../constants/categories')
const { SFI } = require('../../constants/scheme-ids')

const getScheduledPaymentRequests = async (started, transaction) => {
  return db.schedule.findAll({
    lock: true,
    skipLocked: true,
    limit: config.scheduleProcessingMaxBatchSize,
    transaction,
    attributes: [
      'scheduleId',
      'paymentRequestId'
    ],
    include: [{
      model: db.paymentRequest,
      as: 'paymentRequest',
      attributes: []
    }],
    where: {
      category: SCHEDULE,
      completed: null,
      voided: null,
      '$paymentRequest.schemeId$': SFI,
      '$paymentRequest.received$': {
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

module.exports = getScheduledPaymentRequests
