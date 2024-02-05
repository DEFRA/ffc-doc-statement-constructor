const { schedulePendingSettlements } = require('./schedule')
const { getStatement, sendStatement, validateStatement } = require('./statement')
const updateScheduleByScheduleId = require('./update-schedule-by-schedule-id')

const processStatements = async () => {
  const pendingStatements = await schedulePendingSettlements()

  for (const pendingStatement of pendingStatements) {
    try {
      const aggregatedStatement = await getStatement(pendingStatement.settlementId, pendingStatement.scheduleId)
      if (validateStatement(aggregatedStatement)) {
        await sendStatement(aggregatedStatement)
      }
      await updateScheduleByScheduleId(pendingStatement.scheduleId)
    } catch (err) {
      console.error(err.message)
    }
  }
}

module.exports = processStatements
