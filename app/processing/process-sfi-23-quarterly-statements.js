const {
  getVerifiedDaxsfi23QuarterlyStatements,
  sendSfi23QuarterlyStatement,
  updateDaxCompletePublishByDaxId,
  resetDaxUnCompletePublishByDaxId,
  getSfi23QuarterlyStatementByPaymentReference
} = require('./sfi-23-quarterly-statement')

const processSfi23QuarterlyStatement = async () => {
  const daxs = await getVerifiedDaxsfi23QuarterlyStatements()

  for (const dax of daxs) {
    try {
      const sfi23QuaterlyStaement = await getSfi23QuarterlyStatementByPaymentReference(dax.paymentReference)
      await sendSfi23QuarterlyStatement(sfi23QuaterlyStaement)
      await updateDaxCompletePublishByDaxId(dax.daxId)
    } catch (err) {
      console.error(err.message)
    }
  }

  for (const dax of daxs) {
    try {
      await resetDaxUnCompletePublishByDaxId(dax.daxId)
    } catch (err) {
      console.error(err.message)
    }
  }
}

module.exports = processSfi23QuarterlyStatement
