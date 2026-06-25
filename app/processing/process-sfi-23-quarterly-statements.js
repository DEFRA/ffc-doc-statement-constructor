const getExcludedPaymentReferenceByPaymentReference = require('../utility/get-excluded-payment-reference-by-payment-reference')
const {
  getVerifiedDaxsSfi23QuarterlyStatements,
  sendSfi23QuarterlyStatement,
  updateDaxCompletePublishByDaxId,
  resetDaxUnCompletePublishByDaxId,
  getSfi23QuarterlyStatement
} = require('./sfi-23-quarterly-statement')
const validateDax = require('./sfi-23-quarterly-statement/dax/validate-dax')

const MAX_CONCURRENT_STATEMENTS = 5

const handleProcessingError = async (dax, err) => {
  console.error(`Error processing SFI-23 statement for payment reference ${dax.paymentReference}: ${err.message}`)
  try {
    await resetDaxUnCompletePublishByDaxId(dax.daxId)
  } catch (resetErr) {
    console.error(`Error resetting incomplete publish for DAX ID ${dax.daxId}: ${resetErr.message}`)
  }
}

const processItem = async (dax) => {
  validateDax(dax)
  const paymentReferenceIsExcluded = await getExcludedPaymentReferenceByPaymentReference(dax.paymentReference)
  if (paymentReferenceIsExcluded) {
    console.log(`Payment reference ${dax.paymentReference} is excluded from SFI-23 quarterly statement processing`)
  }
  const sfi23QuarterlyStatement = await getSfi23QuarterlyStatement(dax, paymentReferenceIsExcluded)
  await sendSfi23QuarterlyStatement(sfi23QuarterlyStatement)
  await updateDaxCompletePublishByDaxId(dax.daxId)
}

const processSfi23QuarterlyStatement = async () => {
  const daxs = await getVerifiedDaxsSfi23QuarterlyStatements()
  let processed = 0

  for (let i = 0; i < daxs.length; i += MAX_CONCURRENT_STATEMENTS) {
    const batch = daxs.slice(i, i + MAX_CONCURRENT_STATEMENTS)
    const results = await Promise.allSettled(batch.map(dax => processItem(dax)))
    for (let j = 0; j < results.length; j++) {
      if (results[j].status === 'fulfilled') {
        processed += 1
      } else {
        await handleProcessingError(batch[j], results[j].reason)
      }
    }
  }

  return processed
}

module.exports = processSfi23QuarterlyStatement
