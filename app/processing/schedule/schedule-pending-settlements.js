const db = require('../../data')

const getScheduledSettlements = require('./get-scheduled-settlements')
const getValidScheduled = require('./get-valid-scheduled')
const getUpdatedScheduled = require('./get-updated-scheduled')

const schedulePendingSettlements = async () => {
  const started = new Date()
  const transaction = await db.sequelize.transaction()
  try {
    const scheduledSettlements = await getScheduledSettlements(started, transaction)
    const validScheduledSettlements = getValidScheduled(scheduledSettlements)
    const updatedScheduledSettlements = await getUpdatedScheduled(validScheduledSettlements, started, transaction)
    await transaction.commit()
    return updatedScheduledSettlements
  } catch (err) {
    await transaction.rollback()
    console.error('Could not schedule settlements', err)
    return []
  }
}

module.exports = schedulePendingSettlements
