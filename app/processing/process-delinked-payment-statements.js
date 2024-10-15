const {
  getVerifiedD365DelinkedStatements,
  sendDelinkedStatement,
  updateD365CompletePublishByD365Id,
  resetD365UnCompletePublishByD365Id,
  getDelinkedStatementByPaymentReference
} = require('./delinked-statement')

const processDelinkedStatement = async () => {
  const d365 = await getVerifiedD365DelinkedStatements()

  for (const item of d365) {
    try {
      const delinkedStatement = await getDelinkedStatementByPaymentReference(item.paymentReference)
      await sendDelinkedStatement(delinkedStatement)
      await updateD365CompletePublishByD365Id(item.d365Id)
    } catch (err) {
      console.error(`Error processing delinked statement for payment reference ${item.paymentReference}: ${err.message}`)
    }
  }

  for (const item of d365) {
    try {
      await resetD365UnCompletePublishByD365Id(item.d365Id)
    } catch (err) {
      console.error(`Error resetting incomplete publish for D365 ID ${item.d365Id}: ${err.message}`)
    }
  }
}

module.exports = processDelinkedStatement
