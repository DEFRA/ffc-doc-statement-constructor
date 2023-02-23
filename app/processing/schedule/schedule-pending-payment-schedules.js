const db = require('../../data')

const getScheduledPaymentSchedules = require('./get-scheduled-payment-schedules')
const getValidScheduled = require('./get-valid-scheduled')
const getUpdatedSchedule = require('./get-updated-scheduled')
const getRemovedDefunctPaymentSchedules = require('./get-removed-defunct-payment-schedules')

const schedulePendingPaymentSchedules = async () => {
  const started = new Date()
  const transaction = await db.sequelize.transaction()
  try {
    const scheduledPaymentSchedules = await getScheduledPaymentSchedules(started, transaction)
    const validScheduledPaymentSchedules = getValidScheduled(scheduledPaymentSchedules)
    const updatedScheduledPaymentSchedules = await getUpdatedSchedule(validScheduledPaymentSchedules, started, transaction)
    const removedDefunctPaymentSchedules = await getRemovedDefunctPaymentSchedules(updatedScheduledPaymentSchedules, started, transaction)
    await transaction.commit()
    return removedDefunctPaymentSchedules
  } catch (err) {
    await transaction.rollback()
    console.error('Could not schedule payment schedules', err)
    return []
  }
}

module.exports = schedulePendingPaymentSchedules
