const {
  getVerifiedD365DelinkedPaymentStatements,
  sendDelinkedStatement,
  updateD365CompletePublishByD365Id,
  resetD365UnCompletePublishByD365Id,
  getDelinkedStatementByPaymentReference,
  getExcludedPaymentReferenceByPaymentReference
} = require('./delinked-statement')

const processDelinkedStatement = async () => {
  const d365 = await getVerifiedD365DelinkedPaymentStatements()

  for (const item of d365) {
    try {
      const paymentReferenceIsExcluded = await getExcludedPaymentReferenceByPaymentReference(item.paymentReference)
      if (paymentReferenceIsExcluded) {
        console.log(`Payment reference ${item.paymentReference} is excluded from Delinked statement processing`)
      }
      const delinkedStatement = await getDelinkedStatementByPaymentReference(item.paymentReference, paymentReferenceIsExcluded)
      await sendDelinkedStatement(delinkedStatement)
      await updateD365CompletePublishByD365Id(item.d365Id)
    } catch (err) {
      console.error(err.message)
    }
  }

  for (const item of d365) {
    try {
      await resetD365UnCompletePublishByD365Id(item.d365Id)
    } catch (err) {
      console.error(err.message)
    }
  }
}

module.exports = processDelinkedStatement
