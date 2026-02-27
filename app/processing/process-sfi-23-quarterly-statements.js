const getExcludedPaymentReferenceByPaymentReference = require('../utility/get-excluded-payment-reference-by-payment-reference')
const {
  getVerifiedDaxsSfi23QuarterlyStatements,
  sendSfi23QuarterlyStatement,
  updateDaxCompletePublishByDaxId,
  resetDaxUnCompletePublishByDaxId,
  getSfi23QuarterlyStatement
} = require('./sfi-23-quarterly-statement')
const validateDax = require('./sfi-23-quarterly-statement/dax/validate-dax')

const processSfi23QuarterlyStatement = async () => {
  const daxs = await getVerifiedDaxsSfi23QuarterlyStatements()
  let processed = 0

  for (const dax of daxs) {
    try {
      validateDax(dax)
      const paymentReferenceIsExcluded = await getExcludedPaymentReferenceByPaymentReference(dax.paymentReference)
      if (paymentReferenceIsExcluded) {
        console.log(`Payment reference ${dax.paymentReference} is excluded from SFI-23 quarterly statement processing`)
      }
      const sfi23QuarterlyStatement = await getSfi23QuarterlyStatement(dax, paymentReferenceIsExcluded)
      await sendSfi23QuarterlyStatement(sfi23QuarterlyStatement)
      await updateDaxCompletePublishByDaxId(dax.daxId)
      processed += 1
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

  return processed
}

module.exports = processSfi23QuarterlyStatement
