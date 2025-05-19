const {
  getVerifiedDaxsSfi23QuarterlyStatements,
  sendSfi23QuarterlyStatement,
  updateDaxCompletePublishByDaxId,
  resetDaxUnCompletePublishByDaxId,
  getSfi23QuarterlyStatementByPaymentReference,
  getExcludedPaymentReferenceByPaymentReference
} = require('./sfi-23-quarterly-statement')

const processSfi23QuarterlyStatement = async () => {
  const daxs = await getVerifiedDaxsSfi23QuarterlyStatements()

  for (const dax of daxs) {
    try {
      const paymentReferenceIsExcluded = await getExcludedPaymentReferenceByPaymentReference(dax.paymentReference)
      if (paymentReferenceIsExcluded) {
        console.log(`Payment reference ${dax.paymentReference} is excluded from SFI-23 quarterly statement processing`)
      }
      const sfi23QuarterlyStatement = await getSfi23QuarterlyStatementByPaymentReference(dax.calculationId, paymentReferenceIsExcluded)
      await sendSfi23QuarterlyStatement(sfi23QuarterlyStatement)
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
