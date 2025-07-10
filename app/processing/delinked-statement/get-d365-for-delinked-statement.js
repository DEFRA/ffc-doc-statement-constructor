const db = require('../../data')
const config = require('../../config').processingConfig

const getD365ForDelinkedStatement = async (transaction) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const d365ForDelinkedStatement = await db.d365.findAll({
      lock: true,
      skipLocked: true,
      order: [
        ['lastProcessAttempt', 'ASC']
      ],
      limit: config.maxProcessingBatchSize,
      transaction,
      attributes: [
        'd365Id',
        'calculationId',
        'paymentReference'
      ],
      where: {
        startPublish: null,
        transactionDate: { [db.Sequelize.Op.lt]: today }
      },
      raw: true
    })
    return d365ForDelinkedStatement
  } catch (error) {
    console.error('Error fetching D365 for delinked statement:', error)
    throw new Error('Failed to fetch D365 for delinked statement')
  }
}

module.exports = getD365ForDelinkedStatement
