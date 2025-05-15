const Joi = require('joi')
const number1 = 1
const number250 = 250
const number10000 = 10000
const docStatementConstructor = 'ffc-doc-statement-constructor'

const mqSchema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object(),
    managedIdentityClientId: Joi.string().optional()
  },
  statementDataSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription')
  },
  statementTopic: {
    address: Joi.string(),
    source: Joi.string()
  },
  idleCheckBatchSize: Joi.number().default(number250),
  idleCheckMaxDeliveryCount: Joi.number().default(number1),
  idleCheckInterval: Joi.number().default(number10000)
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === 'production',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined,
    managedIdentityClientId: process.env.AZURE_CLIENT_ID
  },
  statementDataSubscription: {
    address: process.env.DATA_SUBSCRIPTION_ADDRESS,
    topic: process.env.DATA_TOPIC_ADDRESS,
    type: 'subscription'
  },
  statementTopic: {
    address: process.env.STATEMENT_TOPIC_ADDRESS,
    source: docStatementConstructor
  },
  idleCheckBatchSize: process.env.IDLE_CHECK_BATCH_SIZE,
  idleCheckMaxDeliveryCount: process.env.IDLE_CHECK_MAX_DELIVERY_COUNT,
  idleCheckInterval: process.env.IDLE_CHECK_INTERVAL
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const statementDataSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.statementDataSubscription }
const statementTopic = { ...mqResult.value.messageQueue, ...mqResult.value.statementTopic }
const idleCheckBatchSize = mqResult.value.idleCheckBatchSize
const idleCheckMaxDeliveryCount = mqResult.value.idleCheckMaxDeliveryCount
const idleCheckInterval = mqResult.value.idleCheckInterval

module.exports = {
  statementDataSubscription,
  statementTopic,
  idleCheckBatchSize,
  idleCheckMaxDeliveryCount,
  idleCheckInterval
}
