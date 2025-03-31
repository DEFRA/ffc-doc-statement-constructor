const {
  getVerifiedD365DelinkedStatements,
  sendDelinkedStatement,
  updateD365CompletePublishByD365Id,
  resetD365UnCompletePublishByD365Id,
  getDelinkedStatementByPaymentReference
} = require('./delinked-statement')

const handleProcessingError = async (item, err) => {
  console.error(`Error processing delinked statement for payment reference ${item.paymentReference}: ${err.message}`)
  try {
    await resetD365UnCompletePublishByD365Id(item.d365Id)
  } catch (resetErr) {
    console.error(`Error resetting incomplete publish for D365 ID ${item.d365Id}: ${resetErr.message}`)
  }
}

const processDelinkedStatement = async () => {
  const d365 = await getVerifiedD365DelinkedStatements()

  const batchSize = 25
  const concurrentBatches = 4

  for (let i = 0; i < d365.length; i += (batchSize * concurrentBatches)) {
    const batchPromises = []
    for (let j = 0; j < concurrentBatches; j++) {
      const startIdx = i + (j * batchSize)
      const batch = d365.slice(startIdx, startIdx + batchSize)
      if (batch.length > 0) {
        batchPromises.push(processBatch(batch))
      }
    }

    await Promise.all(batchPromises)
  }
}

const processBatch = async (batch) => {
  return Promise.all(batch.map(async (item) => {
    try {
      const delinkedStatement = await getDelinkedStatementByPaymentReference(item.paymentReference)
      await sendDelinkedStatement(delinkedStatement)
      await updateD365CompletePublishByD365Id(item.d365Id)
    } catch (err) {
      await handleProcessingError(item, err)
    }
  }))
}

module.exports = processDelinkedStatement
