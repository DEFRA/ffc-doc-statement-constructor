const Joi = require('joi')
const maxBatchSize = 100
const tenSecondWaitTime = 10000

const schema = Joi.object({
  sfi23QuarterlyStatementProcessingActive: Joi.boolean().default(true),
  delinkedStatementProcessingActive: Joi.boolean().default(true),
  statementProcessingInterval: Joi.number().default(tenSecondWaitTime),
  maxProcessingBatchSize: Joi.number().default(maxBatchSize)
})

const config = {
  sfi23QuarterlyStatementProcessingActive: process.env.SFI23_QUARTERLY_STATEMENT_PROCESSING_ACTIVE,
  delinkedStatementProcessingActive: process.env.DELINKED_STATEMENT_PROCESSING_ACTIVE,
  statementProcessingInterval: process.env.STATEMENT_PROCESSING_INTERVAL,
  maxProcessingBatchSize: process.env.MAX_PROCESSING_BATCH_SIZE
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

module.exports = result.value
