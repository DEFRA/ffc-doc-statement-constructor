const publishDelinkedStatement = require('./publish-delinked-statement')

const sendDelinkedStatement = async (delinkedStatement) => {
  try {
    await publishDelinkedStatement(delinkedStatement)
  } catch (err) {
    throw new Error(`Failed to send statement for D365 Payment Reference: ${delinkedStatement.paymentReference}`, err)
  }
}

module.exports = sendDelinkedStatement
