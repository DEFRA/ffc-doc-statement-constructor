const { schedulePendingSettlements } = require('./schedule')
const { getSfi23AdvancedStatement, sendSfi23AdvancedStatement, validateSfi23AdvancedStatement } = require('./sfi-23-advanced-statement')
const updateScheduleByScheduleId = require('./update-schedule-by-schedule-id')
const { SFI23ADVANCEDSTATEMENT } = require('../constants/categories')

const processSfi23AdvancedStatements = async () => {
  const pendingSfi23AdvancedStatements = await schedulePendingSettlements(SFI23ADVANCEDSTATEMENT)

  for (const pendingSfi23AdvancedStatement of pendingSfi23AdvancedStatements) {
    try {
      const aggregatedSfi23AdvancedStatement = await getSfi23AdvancedStatement(pendingSfi23AdvancedStatement.settlementId, pendingSfi23AdvancedStatement.scheduleId)
      if (validateSfi23AdvancedStatement(aggregatedSfi23AdvancedStatement)) {
        await sendSfi23AdvancedStatement(aggregatedSfi23AdvancedStatement)
      }
      await updateScheduleByScheduleId(pendingSfi23AdvancedStatement.scheduleId)
    } catch (err) {
      console.error(err.message)
    }
  }
}

module.exports = processSfi23AdvancedStatements
