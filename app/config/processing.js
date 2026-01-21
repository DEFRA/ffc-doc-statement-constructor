const Joi = require('joi')
const maxBatchSize = 250
const defaultStatementProcessingInterval = 60000

const schema = Joi.object({
  sfi23QuarterlyStatementProcessingActive: Joi.boolean().default(true),
  delinkedStatementProcessingActive: Joi.boolean().default(true),
  statementProcessingInterval: Joi.number().default(defaultStatementProcessingInterval),
  maxProcessingBatchSize: Joi.number().default(maxBatchSize),
  pollWindow: Joi.object({
    start: Joi.string().default('00:00'),
    end: Joi.string().default('23:59'),
    days: Joi.array().items(
      Joi.string().valid('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat')
    ).default(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  }).default({ start: '00:00', end: '23:59', days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] })
})

const config = {
  sfi23QuarterlyStatementProcessingActive: process.env.SFI23_QUARTERLY_STATEMENT_PROCESSING_ACTIVE,
  delinkedStatementProcessingActive: process.env.DELINKED_STATEMENT_PROCESSING_ACTIVE,
  statementProcessingInterval: process.env.STATEMENT_PROCESSING_INTERVAL,
  maxProcessingBatchSize: process.env.MAX_PROCESSING_BATCH_SIZE,
  pollWindow: {
    start: process.env.POLL_WINDOW_START,
    end: process.env.POLL_WINDOW_END,
    days: process.env.POLL_WINDOW_DAYS ? process.env.POLL_WINDOW_DAYS.split(',') : undefined
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

module.exports = result.value
