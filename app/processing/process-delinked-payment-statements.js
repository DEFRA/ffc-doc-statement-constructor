const {
  getVerifiedD365DelinkedStatements,
  sendDelinkedStatement,
  updateD365CompletePublishByD365Id,
  resetD365UnCompletePublishByD365Id,
  getDelinkedStatementByPaymentReference,
  checkIfExcluded
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
      const excluded = await checkIfExcluded(item)
      if (excluded) {
        console.log(`Statement ${item.paymentReference} for customer ${item.frn} has been identified as on hold or subject to a PPA. A statement will not be produced.`)
      } else {
        const delinkedStatement = await getDelinkedStatementByPaymentReference(item.paymentReference)
        await sendDelinkedStatement(delinkedStatement)
      }
      await updateD365CompletePublishByD365Id(item.d365Id)
    } catch (err) {
      await handleProcessingError(item, err)
    }
  }
}

module.exports = processDelinkedStatement
