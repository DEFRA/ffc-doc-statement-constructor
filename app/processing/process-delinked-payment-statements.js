const getExcludedPaymentReferenceByPaymentReference = require('../utility/get-excluded-payment-reference-by-payment-reference')
const {
  getVerifiedD365DelinkedStatements,
  sendDelinkedStatement,
  updateD365CompletePublishByD365Id,
  resetD365UnCompletePublishByD365Id,
  getDelinkedStatementByPaymentReference,
  validateDelinkedStatement
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

  for (const item of d365) {
    try {
      const paymentReferenceIsExcluded = await getExcludedPaymentReferenceByPaymentReference(item.paymentReference)
      if (paymentReferenceIsExcluded) {
        console.log(`Payment reference ${item.paymentReference} is excluded from Delinked statement processing`)
      }
      const delinkedStatement = await getDelinkedStatementByPaymentReference(item.paymentReference, paymentReferenceIsExcluded)
      validateDelinkedStatement(delinkedStatement)
      await sendDelinkedStatement(delinkedStatement)
      await updateD365CompletePublishByD365Id(item.d365Id)
    } catch (err) {
      await handleProcessingError(item, err)
    }
  }
}

module.exports = processDelinkedStatement
