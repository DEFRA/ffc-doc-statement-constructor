const Joi = require('joi')
const docStatementConstructor = 'ffc-doc-statement-constructor'

const mqSchema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    managedIdentityClientId: Joi.string().optional()
  },
  statementDataSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription'),
    maxConcurrentCalls: Joi.number().default(15)
  },
  retentionSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
  },
  statementTopic: {
    address: Joi.string(),
    source: Joi.string()
  },
  alertTopic: {
    address: Joi.string()
  }
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === 'production',
    managedIdentityClientId: process.env.AZURE_CLIENT_ID
  },
  statementDataSubscription: {
    address: process.env.DATA_SUBSCRIPTION_ADDRESS,
    topic: process.env.DATA_TOPIC_ADDRESS,
    type: 'subscription',
    maxConcurrentCalls: process.env.DATA_MAX_CONCURRENT_CALLS
  },
  retentionSubscription: {
    address: process.env.RETENTION_SUBSCRIPTION_ADDRESS,
    topic: process.env.RETENTION_TOPIC_ADDRESS,
    type: 'subscription'
  },
  statementTopic: {
    address: process.env.STATEMENT_TOPIC_ADDRESS,
    source: docStatementConstructor
  },
  alertTopic: {
    address: process.env.ALERT_TOPIC_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const statementDataSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.statementDataSubscription }
const retentionSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.retentionSubscription }
const statementTopic = { ...mqResult.value.messageQueue, ...mqResult.value.statementTopic }
const alertTopic = { ...mqResult.value.messageQueue, ...mqResult.value.alertTopic }

module.exports = {
  statementDataSubscription,
  retentionSubscription,
  statementTopic,
  alertTopic
}
