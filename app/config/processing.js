const Joi = require('joi')
const number100 = 100
const number10000 = 10000
const number300000 = 300000

const schema = Joi.object({
  settlementProcessingInterval: Joi.number().default(number10000), // 10 seconds
  scheduleProcessingMaxElapsedTime: Joi.number().default(number300000), // 5 minutes
  scheduleProcessingMaxBatchSize: Joi.number().default(number100),
  statementConstructionActive: Joi.boolean().default(false),
  scheduleConstructionActive: Joi.boolean().default(false),
  sfi23AdvancedStatementConstructionActive: Joi.boolean().default(true),
  sfi23QuarterlyStatementConstructionActive: Joi.boolean().default(true),
  delinkedStatementConstructionActive: Joi.boolean().default(false),
  settlementWaitTime: Joi.number().default(number10000) // 10 seconds
})

const config = {
  settlementProcessingInterval: process.env.SETTLEMENT_PROCESSING_INTERVAL,
  scheduleProcessingMaxElapsedTime: process.env.SCHEDULE_PROCESSING_ELAPSED_MAX_TIME,
  scheduleProcessingMaxBatchSize: process.env.SCHEDULE_PROCESSING_MAX_BATCH_SIZE,
  statementConstructionActive: process.env.STATEMENT_CONSTRUCTION_ACTIVE,
  scheduleConstructionActive: process.env.SCHEDULE_CONSTRUCTION_ACTIVE,
  sfi23AdvancedStatementConstructionActive: process.env.SFI_23_ADVANCED_STATEMENT_CONSTRUCTION_ACTIVE,
  sfi23QuarterlyStatementConstructionActive: process.env.SFI_23_QUARTERLY_STATEMENT_CONSTRUCTION_ACTIVE,
  delinkedStatementConstructionActive: process.env.DELINKED_STATEMENT_CONSTRUCTION_ACTIVE,
  settlementWaitTime: process.env.SETTLEMENT_WAIT_TIME
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

module.exports = result.value
