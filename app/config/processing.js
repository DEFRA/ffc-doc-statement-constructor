const Joi = require('joi')

const schema = Joi.object({
  settlementProcessingInterval: Joi.number().default(10000), // 10 seconds
  scheduleProcessingMaxElapsedTime: Joi.number().default(300000), // 5 minutes
  scheduleProcessingMaxBatchSize: Joi.number().default(100),
  statementConstructionActive: Joi.boolean().default(true),
  scheduleConstructionActive: Joi.boolean().default(true),
  settlementWaitTime: Joi.number().default(10000) // 10 seconds
})

const config = {
  settlementProcessingInterval: process.env.SETTLEMENT_PROCESSING_INTERVAL,
  scheduleProcessingMaxElapsedTime: process.env.SCHEDULE_PROCESSING_ELAPSED_MAX_TIME,
  scheduleProcessingMaxBatchSize: process.env.SCHEDULE_PROCESSING_MAX_BATCH_SIZE,
  statementConstructionActive: process.env.STATEMENT_CONSTRUCTION_ACTIVE,
  scheduleConstructionActive: process.env.SCHEDULE_CONSTRUCTION_ACTIVE,
  settlementWaitTime: process.env.SETTLEMENT_WAIT_TIME
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

module.exports = result.value
