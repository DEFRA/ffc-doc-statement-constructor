const publishSfi23QuarterlyStatement = require('./publish-sfi23-quarterly-statement')

const sendSfi23QuarterlyStatement = async (sfi23QuarterlyStatement) => {
  try {
    await publishSfi23QuarterlyStatement(sfi23QuarterlyStatement)
  } catch (err) {
    throw new Error(`Failed to send statement for Dax Payment Reference: ${sfi23QuarterlyStatement.paymentReference}`, err)
  }
}

module.exports = sendSfi23QuarterlyStatement
