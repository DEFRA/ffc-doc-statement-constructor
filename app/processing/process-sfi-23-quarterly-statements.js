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

  const batchSize = 25
  const concurrentBatches = 4

  for (let i = 0; i < daxs.length; i += (batchSize * concurrentBatches)) {
    const batchPromises = []

    for (let j = 0; j < concurrentBatches; j++) {
      const startIdx = i + (j * batchSize)
      const batch = daxs.slice(startIdx, startIdx + batchSize)
      if (batch.length > 0) {
        batchPromises.push(processBatch(batch))
      }
    }

    await Promise.all(batchPromises)
  }
}

const processBatch = async (batch) => {
  return Promise.all(batch.map(async (dax) => {
    try {
      const paymentReferenceIsExcluded = await getExcludedPaymentReferenceByPaymentReference(dax.paymentReference)
      if (paymentReferenceIsExcluded) {
        console.log(`Payment reference ${dax.paymentReference} is excluded from SFI-23 quarterly statement processing`)
        return
      }

      const sfi23QuarterlyStatement = await getSfi23QuarterlyStatementByPaymentReference(dax.paymentReference, paymentReferenceIsExcluded)
      await sendSfi23QuarterlyStatement(sfi23QuarterlyStatement)
      await updateDaxCompletePublishByDaxId(dax.daxId)
    } catch (err) {
      console.error(`Error processing SFI-23 quarterly statement for payment reference ${dax.paymentReference}:`, err.message)
      await resetDaxUnCompletePublishByDaxId(dax.daxId)
    }
  }))
}

module.exports = processSfi23QuarterlyStatement
