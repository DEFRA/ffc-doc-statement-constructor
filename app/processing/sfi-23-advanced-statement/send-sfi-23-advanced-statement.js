const publishSfi23AdvancedStatement = require('./publish-sfi-23-advanced-statement')

const sendSfi23AdvancedStatement = async (sfi23Advancedstatement) => {
  try {
    await publishSfi23AdvancedStatement(sfi23Advancedstatement)
  } catch (err) {
    throw new Error(`Failed to send statement for ${sfi23Advancedstatement.payments[0]?.invoiceNumber}`, err)
  }
}

module.exports = sendSfi23AdvancedStatement
