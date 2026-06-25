const { VALIDATION } = require('../constants/validation')
const getExcludedPaymentReferenceByPaymentReference = require('../utility/get-excluded-payment-reference-by-payment-reference')
const {
  getVerifiedD365DelinkedStatements,
  sendDelinkedStatement,
  updateD365CompletePublishByD365Id,
  resetD365UnCompletePublishByD365Id,
  getDelinkedStatementByPaymentReference,
  validateDelinkedStatement
} = require('./delinked-statement')

const MAX_CONCURRENT_STATEMENTS = 5

const handleProcessingError = async (item, err) => {
  console.error(`Error processing delinked statement for payment reference ${item.paymentReference}: ${err.message}`)
  try {
    if (err.category === VALIDATION) {
      await updateD365CompletePublishByD365Id(item.d365Id)
    } else {
      await resetD365UnCompletePublishByD365Id(item.d365Id)
    }
  } catch (resetErr) {
    console.error(`Error resetting incomplete publish for D365 ID ${item.d365Id}: ${resetErr.message}`)
  }
}

const processItem = async (item) => {
  const paymentReferenceIsExcluded = await getExcludedPaymentReferenceByPaymentReference(item.paymentReference)
  if (paymentReferenceIsExcluded) {
    console.log(`Payment reference ${item.paymentReference} is excluded from Delinked statement processing`)
  }
  const delinkedStatement = await getDelinkedStatementByPaymentReference(item.paymentReference, paymentReferenceIsExcluded)
  await validateDelinkedStatement(delinkedStatement)
  await sendDelinkedStatement(delinkedStatement)
  await updateD365CompletePublishByD365Id(item.d365Id)
}

const processDelinkedStatement = async () => {
  const d365 = await getVerifiedD365DelinkedStatements()
  let processed = 0

  for (let i = 0; i < d365.length; i += MAX_CONCURRENT_STATEMENTS) {
    const batch = d365.slice(i, i + MAX_CONCURRENT_STATEMENTS)
    const results = await Promise.allSettled(batch.map(item => processItem(item)))
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

module.exports = processDelinkedStatement
