const { processingConfig } = require('../config')
const messageConfig = require('../config/message')
const waitForIdleMessaging = require('../messaging/wait-for-idle-messaging')
const processSfi23QuarterlyStatement = require('./process-sfi-23-quarterly-statements')
const processDelinkedStatement = require('./process-delinked-payment-statements')
const MAX_CONCURRENT_TASKS = 2
let taskConfigurations = []

// temporary code to allow npm-link to verify this is a local package until published
const pkg = require('ffc-alerting-utils/package.json')
console.log('Using package at:', require.resolve('ffc-alerting-utils'))
console.log('Name:', pkg.name, 'Version:', pkg.version)

const buildTaskConfigurations = () => {
  const tasks = []

  if (processingConfig.sfi23QuarterlyStatementProcessingActive) {
    tasks.push({
      subscriptions: [messageConfig.statementDataSubscription],
      processFunction: processSfi23QuarterlyStatement,
      name: 'SFI23 Quarterly Statement'
    })
  }

  if (processingConfig.delinkedStatementProcessingActive) {
    tasks.push({
      subscriptions: [messageConfig.statementDataSubscription],
      processFunction: processDelinkedStatement,
      name: 'Delinked Payment Statement'
    })
  } else {
    console.log('Delinked Payment Statement processing is disabled')
  }

  return tasks
}
const processTask = async (subscriptions, processFunction, processName) => {
  try {
    await waitForIdleMessaging(subscriptions, processName)
    await processFunction()
    return { success: true, name: processName }
  } catch (error) {
    console.error(`Error processing ${processName}:`, error)
    return { success: false, name: processName, error }
  }
}

const processBatch = async (tasks) => {
  const results = []

  for (let i = 0; i < tasks.length; i += MAX_CONCURRENT_TASKS) {
    const batch = tasks.slice(i, i + MAX_CONCURRENT_TASKS)
    const batchResults = await Promise.allSettled(batch.map(task => task()))
    results.push(...batchResults)
  }

  return results
}

const processWithInterval = async () => {
  const startTime = Date.now()
  const nextRunTime = startTime + processingConfig.settlementProcessingInterval
  const tasks = taskConfigurations.map(config =>
    () => processTask(config.subscriptions, config.processFunction, config.name)
  )

  try {
    const results = await processBatch(tasks)
    const failures = results.filter(
      r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)
    )

    if (failures.length > 0) {
      console.warn(`${failures.length} out of ${results.length} tasks failed`)
    }
  } catch (error) {
    console.error('Critical error in processing:', error)
  } finally {
    const currentTime = Date.now()
    const delay = Math.max(0, nextRunTime - currentTime)
    setTimeout(processWithInterval, delay)
  }
}

const start = async () => {
  console.log('Starting statement processing service')
  taskConfigurations = buildTaskConfigurations()
  await processWithInterval()
}

module.exports = {
  start,
  processTask,
  processBatch,
  processWithInterval,
  get taskConfigurations () { return taskConfigurations }
}
