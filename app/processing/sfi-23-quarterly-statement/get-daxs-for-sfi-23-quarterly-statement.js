const { dax } = require('../../data')
const config = require('../../config').processingConfig

const getDaxsForSfi23QuarterlyStatement = async (transaction) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const daxRecords = await dax(transaction)
      .select('daxId', 'calculationId', 'paymentReference', 'paymentPeriod', 'paymentAmount', 'transactionDate')
      .whereNull('startPublish')
      .where('transactionDate', '<', today)
      .orderBy('lastProcessAttempt', 'asc')
      .limit(config.maxProcessingBatchSize)
      .forUpdate()
      .skipLocked()
    return daxRecords
  } catch (error) {
    console.error('Error fetching dax records for SFI23 statements:', error)
    throw new Error('Failed to fetch dax records for SFI23 statements')
  }
}

module.exports = getDaxsForSfi23QuarterlyStatement
