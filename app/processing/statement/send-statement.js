const publishStatement = require('./publish-statement')

const sendStatement = async (statement) => {
  try {
    await publishStatement(statement)
  } catch (err) {
    throw new Error(`Failed to send statement for ${statement.payments[0]?.invoiceNumber}`, err)
  }
}

module.exports = sendStatement
