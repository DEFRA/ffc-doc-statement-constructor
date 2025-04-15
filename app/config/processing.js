const Joi = require('joi')
const number100 = 100
const number10000 = 10000
const number6 = 6

const schema = Joi.object({
  settlementProcessingInterval: Joi.number().default(number10000), // 10 seconds
  scheduleProcessingMaxBatchSize: Joi.number().default(number100),
  sfi23QuarterlyStatementConstructionActive: Joi.boolean().default(true),
  settlementWaitTime: Joi.number().default(number10000), // 10 seconds
  delinkedPaymentStatementActive: Joi.boolean().default(true),
  hoursLimit: Joi.number().default(number6) // 6 hours
})

const config = {
  settlementProcessingInterval: process.env.SETTLEMENT_PROCESSING_INTERVAL,
  scheduleProcessingMaxBatchSize: process.env.SCHEDULE_PROCESSING_MAX_BATCH_SIZE,
  sfi23QuarterlyStatementConstructionActive: process.env.SFI_23_QUARTERLY_STATEMENT_CONSTRUCTION_ACTIVE,
  settlementWaitTime: process.env.SETTLEMENT_WAIT_TIME,
  delinkedPaymentStatementActive: process.env.DELINKED_PAYMENT_STATEMENT_ACTIVE,
  hoursLimit: process.env.HOURS_LIMIT
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

module.exports = result.value
