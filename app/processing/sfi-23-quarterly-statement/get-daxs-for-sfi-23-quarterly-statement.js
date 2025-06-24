const db = require('../../data')
const config = require('../../config').processingConfig

const getDaxsForSfi23QuarterlyStatement = async (transaction) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const daxRecords = await db.dax.findAll({
      lock: true,
      skipLocked: true,
      order: [
        ['lastProcessAttempt', 'ASC']
      ],
      limit: config.maxProcessingBatchSize,
      transaction,
      attributes: [
        'daxId',
        'calculationId',
        'paymentReference',
        'paymentPeriod',
        'paymentAmount',
        'transactionDate'
      ],
      where: {
        startPublish: null,
        transactionDate: { [db.Sequelize.Op.lt]: today }
      },
      raw: true
    })
    return daxRecords

  } catch (error) {
      console.error('Error fetching dax records for SFI23 statements:', error)
      throw new Error('Failed to fetch dax records for SFI23 statements')
  }
}

module.exports = getDaxsForSfi23QuarterlyStatement
