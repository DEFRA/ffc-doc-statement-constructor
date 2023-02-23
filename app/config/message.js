const Joi = require('joi')

const mqSchema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object()
  },
  processingSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription')
  },
  submitSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription')
  },
  returnSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription')
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
  idleCheckBatchSize: Joi.number().default(250),
  idleCheckMaxDeliveryCount: Joi.number().default(1),
  idleCheckInterval: Joi.number().default(10000)
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === 'production',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  processingSubscription: {
    address: process.env.PROCESSING_SUBSCRIPTION_ADDRESS,
    topic: process.env.PROCESSING_TOPIC_ADDRESS,
    type: 'subscription'
  },
  submitSubscription: {
    address: process.env.SUBMIT_SUBSCRIPTION_ADDRESS,
    topic: process.env.SUBMIT_TOPIC_ADDRESS,
    type: 'subscription'
  },
  returnSubscription: {
    address: process.env.RETURN_SUBSCRIPTION_ADDRESS,
    topic: process.env.RETURN_TOPIC_ADDRESS,
    type: 'subscription'
  },
  statementDataSubscription: {
    address: process.env.DATA_SUBSCRIPTION_ADDRESS,
    topic: process.env.DATA_TOPIC_ADDRESS,
    type: 'subscription'
  },
  statementTopic: {
    address: process.env.STATEMENT_TOPIC_ADDRESS,
    source: 'ffc-pay-statement-constructor'
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

const processingSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.processingSubscription }
const submitSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.submitSubscription }
const returnSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.returnSubscription }
const statementDataSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.statementDataSubscription }
const statementTopic = { ...mqResult.value.messageQueue, ...mqResult.value.statementTopic }
const idleCheckBatchSize = mqResult.value.idleCheckBatchSize
const idleCheckMaxDeliveryCount = mqResult.value.idleCheckMaxDeliveryCount
const idleCheckInterval = mqResult.value.idleCheckInterval

module.exports = {
  processingSubscription,
  submitSubscription,
  returnSubscription,
  statementDataSubscription,
  statementTopic,
  idleCheckBatchSize,
  idleCheckMaxDeliveryCount,
  idleCheckInterval
}
